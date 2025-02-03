using Microsoft.AspNetCore.Mvc;

namespace MyNotes.Application
{
    public record GetNotesCommand(string? Search, string? SortItem, string? SortOrder)
    {
    }
}
