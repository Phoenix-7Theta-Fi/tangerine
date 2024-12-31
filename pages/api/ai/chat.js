import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '../../../lib/mongodb';
import DOMPurify from 'dompurify';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'No message provided' });
  }

  try {
    // Initialize Generative AI
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const responseModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    // Perform vector search to retrieve relevant blog posts
    const connection = await connectDB();
    const db = await connection.getDatabase();
    const embeddingsCollection = db.collection('blog_embeddings');

    const queryEmbedding = await genAI.getGenerativeModel({ model: 'embedding-001' })
      .embedContent(message);

    const pipeline = [
      {
        $search: {
          knnBeta: {
            vector: queryEmbedding.embedding.values,
            path: "embedding",
            k: 3
          }
        }
      },
      {
        $lookup: {
          from: 'blogposts',
          localField: 'postId',
          foreignField: '_id',
          as: 'blogPost'
        }
      },
      {
        $unwind: '$blogPost'
      },
      {
        $project: {
          _id: 0,
          score: { $meta: "searchScore" },
          title: '$blogPost.title',
          content: '$blogPost.content'
        }
      }
    ];

    const relevantDocs = await embeddingsCollection.aggregate(pipeline).toArray();

    // Prepare context from relevant posts
    const context = relevantDocs.map(doc => 
      `Source: ${doc.title}
       Relevance Score: ${doc.score.toFixed(2)}
       Excerpt: ${doc.content.slice(0, 500)}...`
    ).join('\n\n');

    // Construct prompt with context
    const prompt = `
    You are an Ayurvedic wellness AI assistant. 
    Use the following context to provide a detailed, accurate response to the user's query.
    If the context is relevant, cite the sources. If not, provide a general Ayurvedic perspective.

    Context:
    ${context}

    User Query: ${message}

    Guidelines:
    - Provide a comprehensive and informative response
    - Cite sources when possible
    - Maintain a helpful and compassionate tone
    `;

    // Generate AI response
    const result = await responseModel.generateContent(prompt);
    const responseText = result.response.text();

    // Sanitize the response to prevent XSS
    const sanitizedResponse = DOMPurify.sanitize(responseText);

    // Prepare response with sources
    const responseWithSources = {
      message: sanitizedResponse,
      sources: relevantDocs.map(doc => ({
        title: doc.title,
        relevanceScore: doc.score
      })),
      timestamp: new Date().toISOString()
    };

    res.status(200).json(responseWithSources);

  } catch (error) {
    console.error('AI Chat API Error:', error);
    res.status(500).json({ 
      message: 'Error generating AI response',
      error: error.message 
    });
  }
}