import { AppEventPayloads, AppEventName } from '@superapp/core-contracts';

type EventCallback<T extends AppEventName> = (payload: AppEventPayloads[T]) => void;

/**
 * Event Bus Type-safe cho việc giao tiếp lỏng lẻo giữa các Sub-apps
 */
class EventBusService {
  private listeners: Map<AppEventName, Set<EventCallback<any>>> = new Map();

  on<T extends AppEventName>(event: T, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit<T extends AppEventName>(event: T, payload: AppEventPayloads[T]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${event}:`, err);
        }
      });
    }
  }

  clearAll(): void {
    this.listeners.clear();
  }
}

export const eventBus = new EventBusService();
