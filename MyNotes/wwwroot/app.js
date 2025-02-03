const API_BASE = 'http://localhost:5155/api/notes';
let notes = [];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    setupEventListeners();
});

// Загрузка заметок
async function loadNotes() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Server error');

        notes = await response.json();
        renderNotes();
    } catch (error) {
        showError(error.message);
    }
}

// Создание заметки
async function createNote(title, content) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description: content })
        });

        if (!response.ok) throw new Error('Creation failed');

        loadNotes();
    } catch (error) {
        showError(error.message);
    }
}

// Удаление заметки
async function deleteNote(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Deletion failed');

        loadNotes();
    } catch (error) {
        showError(error.message);
    }
}

// Отрисовка заметок
function renderNotes() {
    const container = document.getElementById('notesContainer');
    const processedNotes = processNotes(notes);

    container.innerHTML = processedNotes.map(note => `
        <div class="note-card">
            <button class="delete-btn" onclick="deleteNote('${note.id}')">×</button>
            <h3>${note.title}</h3>
            <p>${note.description}</p>
            <div class="note-date">
                ${new Date(note.dateCreated).toLocaleString()}
            </div>
        </div>
    `).join('');
}

// Обработка данных
function processNotes(notes) {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const sortMode = document.getElementById('sortSelect').value;

    return notes
        .filter(note =>
            note.title.toLowerCase().includes(searchQuery) ||
            note.description.toLowerCase().includes(searchQuery)
        )
        .sort((a, b) => {
            switch (sortMode) {
                case 'dateDesc': return b.dateCreated.localeCompare(a.dateCreated);
                case 'dateAsc': return a.dateCreated.localeCompare(b.dateCreated);
                case 'titleAsc': return a.title.localeCompare(b.title);
                case 'titleDesc': return b.title.localeCompare(a.title);
            }
        });
}

// Обработчики событий
function setupEventListeners() {
    document.getElementById('noteForm').addEventListener('submit', e => {
        e.preventDefault();
        const title = document.getElementById('titleInput').value.trim();
        const content = document.getElementById('contentInput').value.trim();

        if (title && content) {
            createNote(title, content);
            e.target.reset();
        }
    });

    document.getElementById('searchInput').addEventListener('input', () => renderNotes());
    document.getElementById('sortSelect').addEventListener('change', () => renderNotes());
}

// Отображение ошибок
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    document.body.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}