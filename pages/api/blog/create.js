import { connectDB } from '../../../lib/mongodb';
import EmbeddingService from '../../../lib/embeddings';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let connection = null;
  try {
    connection = await connectDB();
    const db = await connection.getDatabase();
    const blogCollection = db.collection('blogposts');
    const embeddingsCollection = db.collection('blog_embeddings');

    const newPost = req.body;

    // Validate input
    if (!newPost.title || !newPost.content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate embedding
    const embeddingText = `${newPost.title} ${newPost.content}`;
    const embedding = await EmbeddingService.generateEmbedding(embeddingText);

    // Insert the blog post
    const postResult = await blogCollection.insertOne(newPost);

    // Store the embedding
    await embeddingsCollection.insertOne({
      postId: postResult.insertedId,
      text: embeddingText,
      embedding: embedding,
      metadata: {
        title: newPost.title,
        author: newPost.author,
        date: newPost.date,
        tags: newPost.tags
      }
    });

    res.status(201).json({
      message: 'Blog post created successfully',
      postId: postResult.insertedId
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ 
      message: 'Failed to create blog post',
      error: error.message 
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}