const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5155;

// Включить CORS и парсинг JSON
app.use(cors());
app.use(express.json());

// Пример хранилища заметок
let notes = [
    { id: 1, title: 'Заметка 1', description: 'Описание 1' },
    { id: 2, title: 'Заметка 2', description: 'Описание 2' },
];

// Обработка GET-запроса для получения всех заметок
app.get('/api/notes', (req, res) => {
    res.json(notes); // Возвращаем массив заметок
});

// Обработка POST-запроса для создания заметки
app.post('/api/notes', (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }
    const newNote = { id: notes.length + 1, title, description };
    notes.push(newNote);
    res.status(201).json(newNote); // Возвращаем созданную заметку
});

// Обработка GET-запроса к корневому маршруту
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'wwwroot', 'index.html')); // Указываем путь до wwwroot
});

// Правила для обслуживания статических файлов
app.use(express.static(path.join(__dirname, 'wwwroot')));
// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
