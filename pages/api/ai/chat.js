import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '../../../lib/mongodb';
import DOMPurify from 'isomorphic-dompurify';

// Function to add inline citations only
function addInTextCitations(response, sources) {
  let citedResponse = response;
  
  // Create a map of source titles to their citation numbers
  const sourceNumbers = new Map();
  sources.forEach((source, index) => {
    sourceNumbers.set(source.title, index + 1);
  });

  // Remove any existing citations first
  citedResponse = citedResponse.replace(/\[Source: [^\]]+\]/g, '');

  // Track which sources have been cited
  const citedSources = new Set();

  // Add citations for each source
  sources.forEach(source => {
    const citationNumber = sourceNumbers.get(source.title);
    const citation = ` [${citationNumber}]`;
    
    // Split response into paragraphs for better citation placement
    const paragraphs = citedResponse.split('\n\n');
    paragraphs.forEach((paragraph, index) => {
      // Check if paragraph contains relevant keywords
      const keywords = source.title.split(' ').slice(0, 3);
      if (keywords.some(keyword => paragraph.toLowerCase().includes(keyword.toLowerCase()))) {
        // Add citation after relevant paragraph
        paragraphs[index] = `${paragraph}${citation}`;
        citedSources.add(source.title);
      }
    });
    citedResponse = paragraphs.join('\n\n');
  });

  return citedResponse;
}

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

    // Generate embedding for the query
    const queryEmbedding = await genAI.getGenerativeModel({ model: 'embedding-001' })
      .embedContent(message);

    // Enhanced vector search pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: queryEmbedding.embedding.values,
          numCandidates: 100,
          limit: 3
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
          postId: '$blogPost._id',
          score: { $meta: 'vectorSearchScore' },
          title: '$blogPost.title',
          content: '$blogPost.content'
        }
      }
    ];

    console.log('Executing vector search pipeline...');
    const relevantDocs = await embeddingsCollection.aggregate(pipeline).toArray();
    console.log('Found relevant documents:', relevantDocs);

    // Prepare enhanced context with source details
    const sourceContext = relevantDocs.map((doc, index) => `
      [Source ${index + 1}: ${doc.title} - Relevance: ${doc.score.toFixed(2)}]
      Key Excerpt: ${doc.content.slice(0, 300)}...
    `).join('\n\n');

    // Construct enhanced prompt with explicit citation restrictions
    const prompt = `
    ADVANCED RESPONSE GUIDELINES:

    1. Role: You are an Ayurvedic wellness AI assistant

    2. Citation Rules:
       - ONLY use citations from the provided sources below
       - NEVER cite sources not listed below
       - Format citations as [Number]
       - Include specific section/page references when possible
       - Be precise about which part of the source supports your statement

    3. Available Sources:
    ${sourceContext}

    4. Response Composition Rules:
       - Start with a concise direct answer
       - Provide detailed explanation
       - Explicitly link statements to source materials
       - If no direct source matches, clearly state general Ayurvedic principle
       - NEVER make up or invent sources

    5. User Query Context:
       Query: ${message}

    GENERATE RESPONSE NOW:
    `;

    // Generate AI response
    const result = await responseModel.generateContent(prompt);
    let responseText = result.response.text();

    // Add inline citations through post-processing
    responseText = addInTextCitations(responseText, relevantDocs);

    // Sanitize the response to prevent XSS
    const sanitizedResponse = DOMPurify.sanitize(responseText);

    // Prepare response with sources
    const responseWithSources = {
      message: sanitizedResponse,
      sources: relevantDocs.map(doc => ({
        id: doc.postId.toString(),
        title: doc.title,
        relevanceScore: doc.score,
        excerpt: doc.content.slice(0, 200)
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