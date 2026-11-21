namespace Lights_Off.Models
{
    public class KnowledgeChunk
    {
        public int KnowledgeChunkId { get; set; }
        public string SourceTitle {  get; set; } = string.Empty;
        public string RetrievedInformation { get; set; } = string.Empty;
        public List<float> Embeddings { get; set; } = new List<float>();

    }
}
