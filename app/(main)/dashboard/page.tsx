import Link from "next/link";

const sampleStats = {
  posts: 12,
  followers: 190,
  following: 48,
};

export default function DashboardPage() {
  return (
    <div className="min-w-full min-h-screen p-8">
      <div className="max-w-[900px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/create" className="rounded-md border border-border px-3 py-1 text-sm">
            New post
          </Link>
        </header>

        <section className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-md border border-border bg-card/50">
            <div className="text-sm text-muted-foreground">Posts</div>
            <div className="text-2xl font-semibold">{sampleStats.posts}</div>
          </div>
          <div className="p-4 rounded-md border border-border bg-card/50">
            <div className="text-sm text-muted-foreground">Followers</div>
            <div className="text-2xl font-semibold">{sampleStats.followers}</div>
          </div>
          <div className="p-4 rounded-md border border-border bg-card/50">
            <div className="text-sm text-muted-foreground">Following</div>
            <div className="text-2xl font-semibold">{sampleStats.following}</div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Recent posts</h2>
          <ul className="space-y-3">
            <li className="p-3 rounded-md border border-border bg-card/50">How I built a small video blog</li>
            <li className="p-3 rounded-md border border-border bg-card/50">Designing for readable article pages</li>
            <li className="p-3 rounded-md border border-border bg-card/50">Optimizing images in Next.js</li>
          </ul>
        </section>
      </div>
    </div>
  );
}