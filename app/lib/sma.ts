import CircularBuffer from './providers/circular-buffer.ts';

class SMA {
  private period: number;
  private circular: CircularBuffer<number>;
  private sum: number;
  public nextValue: (value: number) => number | undefined;
  public momentValue: (value: number) => number | undefined;

  constructor(period: number) {
    this.period = period;
    this.circular = new CircularBuffer<number>(period);
    this.sum = 0;

    // Initial nextValue function (before buffer is filled)
    this.nextValue = (value: number): number | undefined => {
      this.circular.push(value);
      this.sum += value;
      if (!this.circular.filled) return undefined; // Not enough data yet

      // Overwrite nextValue with the actual SMA calculation logic
      this.nextValue = (value: number): number => {
        this.sum = this.sum - this.circular.push(value)! + value;
        return this.sum / this.period;
      };

      // Define momentValue calculation
      this.momentValue = (value: number): number => {
        return (this.sum - this.circular.peek()! + value) / this.period;
      };

      return this.sum / this.period; // Initial SMA value
    };

    // Placeholder for momentValue (before buffer is filled)
    this.momentValue = (): undefined => undefined;
  }
}

export default SMA;

