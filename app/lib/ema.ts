import SMA from './sma.ts'; // Import the SMA class

class EMA {
  private period: number;
  private smooth: number;
  private ema: number | null;
  private sma: SMA;
  public nextValue: (value: number) => number | undefined;
  public momentValue: (value: number) => number | undefined;

  constructor(period: number) {
    this.period = period;
    this.smooth = 2 / (period + 1);
    this.ema = null;  // Initialize EMA as null (no initial value)
    this.sma = new SMA(period);

    // Initial nextValue function (before SMA is calculated)
    this.nextValue = (value: number): number | undefined => {
      const sma = this.sma.nextValue(value);
      if (sma !== undefined) {
        this.ema = sma; // Set initial EMA to SMA once it's available

        // Overwrite nextValue with the EMA calculation
        this.nextValue = (value: number): number => {
          this.ema = (value - this.ema!) * this.smooth + this.ema!;
          return this.ema;
        };

        // Define momentValue calculation
        this.momentValue = (value: number): number => {
          return (value - this.ema!) * this.smooth + this.ema!;
        };
      }
      return sma;
    };

    // Placeholder for momentValue (before EMA is calculated)
    this.momentValue = (): undefined => undefined;
  }
}

export default EMA;

