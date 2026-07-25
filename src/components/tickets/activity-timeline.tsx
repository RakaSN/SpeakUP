interface ActivityItem {
  id: string;
  actionLabel: string;
  actor: { name: string };
  createdAt: Date | string;
  note?: string | null;
}

export function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Riwayat Aktivitas</h3>
      <div className="relative border-l border-muted pl-4 ml-2 space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">{activity.actionLabel}</p>
              <p className="text-xs text-muted-foreground">
                Oleh {activity.actor.name} &bull; {new Date(activity.createdAt).toLocaleString('id-ID')}
              </p>
              {activity.note && (
                <div className="mt-1 rounded-md bg-muted/50 p-2 text-sm italic">
                  &quot;{activity.note}&quot;
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
