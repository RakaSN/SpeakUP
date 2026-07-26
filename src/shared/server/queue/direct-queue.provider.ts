import { QueueJob, QueueProvider } from './queue.interface';

export class DirectQueueProvider implements QueueProvider {
  readonly name = 'DirectExecutionQueue';
  private items: QueueJob<any>[] = [];

  async enqueue<T>(type: string, payload: T): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `qjob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      createdAt: new Date(),
      attempts: 0,
    };
    this.items.push(job);
    return job;
  }

  async dequeue<T>(): Promise<QueueJob<T> | null> {
    const job = this.items.shift();
    return job ? (job as QueueJob<T>) : null;
  }

  async acknowledge(id: string): Promise<void> {
    // In-memory queue removes on dequeue, acknowledge is a no-op
    this.items = this.items.filter((item) => item.id !== id);
  }

  async peek<T>(): Promise<QueueJob<T> | null> {
    return this.items.length > 0 ? (this.items[0] as QueueJob<T>) : null;
  }

  async size(): Promise<number> {
    return this.items.length;
  }
}

export const defaultQueueProvider = new DirectQueueProvider();
