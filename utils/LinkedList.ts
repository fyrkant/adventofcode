export interface LinkedListNode<T> {
  value: T;
  next?: LinkedListNode<T>;
}

export class LinkedList<T> {
  public head?: LinkedListNode<T> = undefined;
  public tail?: LinkedListNode<T> = undefined;

  add(value: T): void {
    const node = {
      value,
      next: undefined,
    };
    if (!this.head) {
      this.head = node;
    }
    if (this.tail) {
      this.tail.next = node;
    }
    this.tail = node;
  }

  dequeue(): T | undefined {
    if (this.head) {
      const value = this.head.value;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = undefined;
      }
      return value;
    }
  }

  *values(): Generator<T, void, unknown> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
