interface AssignmentItem {
  assignee: { name: string };
  assignedAt: Date | string;
}

export function AssignmentHistory({ assignments }: { assignments: AssignmentItem[] }) {
  if (!assignments || assignments.length === 0) return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Petugas Ditugaskan</h3>
      <p className="text-sm text-muted-foreground">Belum ada petugas yang ditugaskan.</p>
    </div>
  );

  const currentAssignment = assignments[0];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Petugas Saat Ini</h3>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {currentAssignment.assignee.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{currentAssignment.assignee.name}</p>
          <p className="text-xs text-muted-foreground">Ditugaskan pada {new Date(currentAssignment.assignedAt).toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}
