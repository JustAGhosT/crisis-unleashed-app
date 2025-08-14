type Listener<T = unknown> = (payload: T) => void;

class EventDispatcher {
  private listeners = new Map<string, Set<Listener>>();

  subscribe<T = unknown>(type: string, listener: Listener<T>): () => void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    const set = this.listeners.get(type)!;
    set.add(listener as Listener);
    return () => {
      set.delete(listener as Listener);
      if (set.size === 0) this.listeners.delete(type);
    };
  }

  publish<T = unknown>(type: string, payload: T): void {
    const set = this.listeners.get(type);
    if (!set) return;
    set.forEach((l) => {
      try {
        (l as Listener<T>)(payload);
      } catch {
        /* swallow */
      }
    });
  }
}

export const realtimeDispatcher = new EventDispatcher();
