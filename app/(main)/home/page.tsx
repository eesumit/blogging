import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  cover?: string;
};

const samplePosts: Post[] = [
  {
    id: "1",
    title: "How I built a small video blog with Next.js",
    excerpt:
      "A short write-up about the architecture, choices and lessons learned while building a small video sharing site.",
    author: "Sumit Kumar",
    readTime: "4 min",
    cover: "/images/home-background-image.jpg",
  },
  {
    id: "2",
    title: "Designing for readable article pages",
    excerpt:
      "A quick guide to spacing, typography and contrast for long-form reading on the web.",
    author: "Jane Doe",
    readTime: "6 min",
  },
  {
    id: "3",
    title: "Optimizing images in Next.js",
    excerpt: "How to use next/image, caching and a few gotchas when deploying.",
    author: "Alex Smith",
    readTime: "3 min",
  },
];

export default function HomePage() {
  return (
    <div className="min-w-full min-h-screen p-8">
      <div className="max-w-[900px] mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold">Discover</h1>
          <Link
            href="/create"
            className="rounded-md border border-border px-3 py-1 text-sm hover:bg-accent/10"
          >
            Write
          </Link>
        </header>

        <main className="space-y-6">
          {samplePosts.map((post) => (
            <article
              key={post.id}
              className="flex gap-6 items-start bg-card/50 p-4 rounded-md border border-border"
            >
              <div className="w-36 h-24 relative flex-shrink-0 rounded overflow-hidden bg-muted">
                {/* {post.cover ? (
                  <Image
                    src={post.cover}
                    alt="cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No image</div>
                )} */}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <Link href={`/profile`} className="underline">
                    View profile
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}