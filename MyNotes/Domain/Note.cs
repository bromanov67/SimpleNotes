namespace MyNotes.Domain
{
    public class Note
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime DateCreated { get; set; }

        private Note() { }
        public Note(string title, string description)
        {
            Title = title;
            Description = description;
            DateCreated = DateTime.UtcNow;
        }
    }
}
