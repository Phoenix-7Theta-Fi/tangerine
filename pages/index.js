import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Tangerine</h1>
      <Link href="/blog" className="text-blue-500 hover:text-blue-700">
        Visit our Blog
      </Link>
      <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 mt-2">
        Create Blog Post
      </Link>
      <Link href="/ai-chat" className="text-blue-500 hover:text-blue-700 mt-2">
        Chat with AI
      </Link>
    </div>
  );
}
