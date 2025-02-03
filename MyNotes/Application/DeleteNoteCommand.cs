using System.Text.Json.Serialization;

namespace MyNotes.Application
{
    public record DeleteNoteCommand
    {
        [JsonPropertyName("noteId")]
        public Guid NoteId { get; set; }
    }
}
