import { connectDB } from '../../lib/mongodb';
import Link from 'next/link';

export default function BlogPage({ posts }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Blog Posts
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id.toString()}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-4">
              <Link href={`/blog/${post._id.toString()}`}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition-colors duration-200">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {post.excerpt}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  By {post.author}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4">
                {post.tags && post.tags.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  let connection = null;
  try {
    connection = await connectDB();
    const db = await connection.getDatabase();
    const blogCollection = db.collection('blogposts');

    const posts = await blogCollection.find({}).toArray();

    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
      },
      revalidate: 60, // Incremental Static Regeneration
    };
  } catch (error) {
    console.error("Blog Fetch Error:", error);
    return {
      props: { posts: [] },
      revalidate: 10 // Fallback regeneration
    };
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}