using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyNotes.Application;
using MyNotes.Domain;
using MyNotes.Infrastucture;

namespace MyNotes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext _dbContext;
        public NotesController(NotesDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] CreateNoteCommand command, CancellationToken cancellationToken)
        {
            var note = new Note(command.Title, command.Description);
            await _dbContext.Notes.AddAsync(note, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetNotes([FromQuery] GetNotesCommand command, CancellationToken cancellationToken)
        {
            var notesQuery = _dbContext.Notes
                .Where(n => string.IsNullOrWhiteSpace(command.Search) ||
                        n.Title.ToLower().Contains(command.Search.ToLower()));

            if (command.SortOrder == "desc")
            {
                notesQuery = notesQuery.OrderByDescending(n => n.DateCreated);
            }
            else
            {
                notesQuery = notesQuery.OrderBy(n => n.DateCreated);
            }

            var notes = await notesQuery.ToListAsync(cancellationToken);
            // Теперь возвращаем список найденных заметок
            return Ok(notes);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var note = await _dbContext.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            _dbContext.Notes.Remove(note);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}

