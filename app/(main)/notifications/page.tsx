type NotificationItem = {
  id: string;
  text: string;
  time: string;
};

const notifications: NotificationItem[] = [
  { id: "1", text: "John commented on your post.", time: "2h" },
  { id: "2", text: "Your post was recommended to a follower.", time: "1d" },
  { id: "3", text: "Anna liked your post.", time: "3d" },
];

export default function NotificationsPage() {
  return (
    <div className="min-w-full min-h-screen p-8">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li key={n.id} className="p-3 rounded-md border border-border bg-card/50">
              <div className="flex justify-between">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}