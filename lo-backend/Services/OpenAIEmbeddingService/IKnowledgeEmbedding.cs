namespace Lights_Off.Services.OpenAIEmbeddingService
{
    public interface IKnowledgeEmbedding 
    {
        Task<List<float>> GetEmbeddingAsync(string text);
    }
}
