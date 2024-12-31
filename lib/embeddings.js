const { GoogleGenerativeAI } = require('@google/generative-ai');

class EmbeddingService {
  constructor() {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not defined');
    }
    this.genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    this.embeddingModel = this.genAI.getGenerativeModel({ 
      model: "embedding-001" 
    });
  }

  async generateEmbedding(text) {
    try {
      if (!text) {
        throw new Error('Text for embedding cannot be empty');
      }

      const result = await this.embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  }
}

module.exports = new EmbeddingService();