export interface QueueJob<T = unknown> {
  id: string;
  type: string;
  payload: T;
  createdAt: Date;
  attempts: number;
}

export interface QueueProvider {
  readonly name: string;
  enqueue<T>(type: string, payload: T): Promise<QueueJob<T>>;
  dequeue<T>(): Promise<QueueJob<T> | null>;
  acknowledge(id: string): Promise<void>;
  peek<T>(): Promise<QueueJob<T> | null>;
  size(): Promise<number>;
}
