using OpenAI;
using OpenAI.Embeddings;

namespace Lights_Off.Services.OpenAIEmbeddingService
{
    public class KnowledgeEmbedding : IKnowledgeEmbedding
    {
        private readonly EmbeddingClient _client;
        public KnowledgeEmbedding(EmbeddingClient client)
        {
            _client = client;
        }
        public async Task<List<float>> GetEmbeddingAsync(string text)
        {
            OpenAIEmbedding embedding = await _client.GenerateEmbeddingAsync(text);

            // Convert the embedding to a list of floats to match the KnowledgeChunk model's Embeddings property
            return embedding.ToFloats().ToArray().ToList();
        }
    }
}
