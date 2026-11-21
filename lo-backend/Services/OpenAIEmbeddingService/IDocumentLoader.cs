using Lights_Off.Models;

namespace Lights_Off.Services.OpenAIEmbeddingService
{
    public interface IDocumentLoader
    {
        Task LoadDocumentsAsync(string directoryPath);
    }
}
