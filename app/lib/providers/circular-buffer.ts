class CircularBuffer<T> {
  private length: number;
  private pointer: number;
  private maxIndex: number;
  private buffer: Array<T | undefined>;
  public filled: boolean;

  constructor(length: number) {
    this.length = length;
    this.pointer = 0;
    this.maxIndex = length - 1;
    this.buffer = new Array(length);
    this.filled = false;
  }

  push(item: T): T | undefined {
    const overwritten = this.buffer[this.pointer];
    this.buffer[this.pointer] = item;
    this.iteratorNext();
    return overwritten;
  }

  // Deprecated: Use peek instead
  pushback(item: T): T | undefined {
    this.iteratorPrev();
    const overwritten = this.buffer[this.pointer];
    this.buffer[this.pointer] = item;
    return overwritten;
  }

  peek(): T | undefined {
    return this.buffer[this.pointer];
  }

  forEach(callback: (item: T | undefined, index: number) => void): void {
    let idx = this.pointer;
    let virtualIdx = 0;
    while (virtualIdx !== this.length) {
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx + 1) % this.length;
      virtualIdx++;
    }
  }

  forEachRight(callback: (item: T | undefined, index: number) => void): void {
    let idx = (this.length + this.pointer - 1) % this.length;
    let virtualIdx = this.length - 1;
    while (virtualIdx !== -1) {  // Changed the condition for forEachRight
      callback(this.buffer[idx], virtualIdx);
      idx = (this.length + idx - 1) % this.length;
      virtualIdx--;
    }
  }

  fill(item: T): void {
    this.buffer.fill(item);
    this.filled = true;
  }

  toArray(): Array<T | undefined> {
    return this.buffer;
  }

  private iteratorNext(): void {
    this.pointer++;
    if (this.pointer > this.maxIndex) {
      this.pointer = 0;
      this.filled = true;
    }
  }

  private iteratorPrev(): void {
    this.pointer--;
    if (this.pointer < 0) {
      this.pointer = this.maxIndex;
    }
  }
}

export default CircularBuffer;


