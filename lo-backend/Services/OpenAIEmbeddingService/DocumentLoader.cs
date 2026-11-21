using Lights_Off.Data;
using Lights_Off.Models;
using Microsoft.EntityFrameworkCore;

namespace Lights_Off.Services.OpenAIEmbeddingService
{
    public class DocumentLoader : IDocumentLoader
    {
        private readonly IKnowledgeEmbedding _knowledgeEmbedding;
        private readonly LightsOffDbContext _context;

        public DocumentLoader(IKnowledgeEmbedding knowledgeEmbedding, LightsOffDbContext context)
        {
            _knowledgeEmbedding = knowledgeEmbedding;
            _context = context;
        }

        public async Task LoadDocumentsAsync(string directoryPath)
        {
            // Load all text files from the directory
            var files = Directory.GetFiles(directoryPath, "*.md");

            foreach (var file in files)
            {
                // Read the content of each file
                string content = await File.ReadAllTextAsync(file);
                // Fix line endings
                content = content.Replace("\r\n", "\n");

                // Split content into paragraphs based on double newlines
                string[] paragraphs = content.Split("\n\n", StringSplitOptions.RemoveEmptyEntries);
                string title = paragraphs[0].Replace("#", "").Trim();

                // already loaded this one, skip it
                if (await _context.KnowledgeChunks.AnyAsync(c => c.SourceTitle == title)) continue;

                int i = 2;
                while (i < paragraphs.Length)
                {
                    // Create a text chunk of up to 1000 characters
                    string textChunk = "";
                    while ((i < paragraphs.Length && textChunk.Length + paragraphs[i].Length < 1000) || textChunk.Length == 0)
                    {
                        textChunk += paragraphs[i] + "\n"; 
                        i++;
                    }

                    // Trim and add the text chunk to the database if it's not empty
                    string finalTextChunk = textChunk.Trim();

                    if (!string.IsNullOrWhiteSpace(finalTextChunk))
                    {
                        // Generate embeddings for each text chunk
                        List<float> embeddings = await _knowledgeEmbedding.GetEmbeddingAsync(finalTextChunk);
                        // Create a new KnowledgeChunk object
                        var knowledgeChunk = new KnowledgeChunk
                        {
                            SourceTitle = title,
                            RetrievedInformation = finalTextChunk,
                            Embeddings = embeddings
                        };
                        // Add the KnowledgeChunk to the database context
                        _context.KnowledgeChunks.Add(knowledgeChunk);
                    }
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}

