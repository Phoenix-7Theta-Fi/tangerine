const { connectDB, client } = require('../lib/mongodb');

const blogPosts = [
  {
    title: "Introduction to Ayurveda",
    excerpt: "Learn the basics of Ayurveda, the ancient Indian system of medicine.",
    author: "Dr. Rajesh Sharma",
    date: "2024-02-15",
    content: "Ayurveda is a holistic healing system that originated in India thousands of years ago...",
    tags: ["ayurveda", "health", "wellness"]
  },
  {
    title: "The Three Doshas in Ayurveda",
    excerpt: "Understanding the concept of Vata, Pitta, and Kapha in Ayurvedic medicine.",
    author: "Dr. Sunita Patel",
    date: "2024-02-20",
    content: "The three doshas are fundamental to Ayurvedic diagnosis and treatment...",
    tags: ["ayurveda", "doshas", "vata", "pitta", "kapha"]
  },
  {
    title: "Ayurvedic Diet Principles",
    excerpt: "Exploring the guidelines for a healthy diet according to Ayurvedic principles.",
    author: "Dr. Anil Kumar",
    date: "2024-02-25",
    content: "Ayurveda emphasizes the importance of food as medicine...",
    tags: ["ayurveda", "diet", "nutrition"]
  },
  {
    title: "Benefits of Ayurvedic Herbs",
    excerpt: "Discover the healing properties of various herbs used in Ayurvedic treatments.",
    author: "Dr. Priya Singh",
    date: "2024-03-01",
    content: "Herbs play a significant role in Ayurvedic therapies...",
    tags: ["ayurveda", "herbs", "natural medicine"]
  },
  {
    title: "Ayurvedic Practices for Stress Reduction",
    excerpt: "Learn about Ayurvedic techniques to manage and reduce stress.",
    author: "Dr. Rohan Verma",
    date: "2024-03-05",
    content: "Ayurveda offers various methods to promote mental and emotional well-being...",
    tags: ["ayurveda", "stress management", "yoga", "meditation"]
  },
  {
    title: "The Importance of Dinacharya (Daily Routine) in Ayurveda",
    excerpt: "Understanding the Ayurvedic concept of a daily routine for optimal health.",
    author: "Dr. Meera Gupta",
    date: "2024-03-10",
    content: "Dinacharya involves aligning daily activities with natural rhythms...",
    tags: ["ayurveda", "daily routine", "lifestyle"]
  },
  {
    title: "Ayurvedic Detoxification: Panchakarma",
    excerpt: "Exploring the powerful detoxification methods in Ayurveda known as Panchakarma.",
    author: "Dr. Vikram Kapoor",
    date: "2024-03-15",
    content: "Panchakarma is a comprehensive system of cleansing the body of toxins...",
    tags: ["ayurveda", "panchakarma", "detox"]
  },
  {
    title: "Ayurvedic Remedies for Common Ailments",
    excerpt: "Learn about simple Ayurvedic remedies for everyday health issues.",
    author: "Dr. Neha Reddy",
    date: "2024-03-20",
    content: "Ayurveda provides natural solutions for common health problems...",
    tags: ["ayurveda", "remedies", "health"]
  },
  {
    title: "Ayurveda and Mental Wellness",
    excerpt: "Understanding the Ayurvedic approach to mental and emotional well-being.",
    author: "Dr. Sanjay Kumar",
    date: "2024-03-25",
    content: "Ayurveda recognizes the interconnectedness of mind and body...",
    tags: ["ayurveda", "mental health", "wellness"]
  },
  {
    title: "Integrating Ayurveda into Modern Lifestyle",
    excerpt: "Tips on how to incorporate Ayurvedic principles into your daily life.",
    author: "Dr. Deepika Menon",
    date: "2024-03-30",
    content: "It's possible to integrate the ancient wisdom of Ayurveda into our modern routines...",
    tags: ["ayurveda", "lifestyle", "integration"]
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    const db = client.db('tangerine');
    const blogCollection = db.collection('blogposts');

    // Clear existing posts
    await blogCollection.deleteMany({});

    // Insert new posts
    const result = await blogCollection.insertMany(blogPosts);
    
    console.log(`${result.insertedCount} blog posts were inserted`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();