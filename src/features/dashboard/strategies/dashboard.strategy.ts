export interface DashboardData {
  roleName: string;
  metrics: {
    total: number;
    resolved: number;
    pending: number;
    overdue?: number;
  };
  recentTickets: Record<string, unknown>[];
  extraWidgets?: Record<string, unknown>;
}

export interface IDashboardStrategy {
  execute(userId: string): Promise<DashboardData>;
}
