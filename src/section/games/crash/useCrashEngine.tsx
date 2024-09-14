import { ECrashStatus } from '@/constants/status';

const CrashSpeed = 0.00006;
const PlotOffsetX = 50;
const PlotOffsetY = 40;
const AdditionalHeightOffset = 50;

export class CrashEngine {
  public startTime = 0;
  private loadingTime = 6000;
  private loadStartTime = Date.now();
  public elapsedTime = 0;
  public graphWidth = 0;
  public graphHeight = 0;
  public plotWidth = 0;
  public plotHeight = 0;
  private xAxis = 0;
  private yAxis = 0;
  private xIncrement = 0;
  private yIncrement = 0;
  private xAxisMinimum = 1000;
  private yAxisMultiplier = 1.5;
  private multiplier = 1;
  public state = ECrashStatus.PREPARE;

  public onResize(width: number, height: number) {
    this.graphWidth = width;
    this.graphHeight = height;
    this.plotWidth = width - PlotOffsetX;
    this.plotHeight = height - PlotOffsetY - AdditionalHeightOffset;
  }

  public getElapsedPayout(elapsedTime: number) {
    const payout = ~~(100 * Math.pow(Math.E, CrashSpeed * elapsedTime)) / 100;
    if (!isFinite(payout)) {
      throw new Error('Infinite payout');
    }
    return Math.max(payout, 1);
  }

  public gameTick() {
    this.elapsedTime = this.getElapsedTime();
    this.multiplier =
      this.state !== ECrashStatus.END
        ? this.getElapsedPayout(this.elapsedTime)
        : 0;
    this.xAxis = Math.max(this.elapsedTime, this.xAxisMinimum);
    this.yAxis = Math.max(this.multiplier, this.yAxisMultiplier);
    this.xIncrement = this.plotWidth / this.xAxis;
    this.yIncrement = this.plotHeight / this.yAxis;
  }

  public getElapsedTime() {
    if (this.state !== ECrashStatus.PROGRESS) {
      return 0;
    }
    return Date.now() - this.startTime;
  }

  public getElapsedLoading() {
    return this.state === ECrashStatus.PREPARE
      ? Date.now() - this.loadStartTime
      : 0;
  }

  public getRemainingLoading() {
    return ((this.loadingTime - this.getElapsedLoading()) / 1000).toFixed(2);
  }

  public getElapsedPosition(elapsedTime: number) {
    const elapsedPayout = this.getElapsedPayout(elapsedTime) - 1;
    return {
      x: elapsedTime * this.xIncrement,
      y: this.plotHeight - elapsedPayout * this.yIncrement
    };
  }

  public getYMultiplier(yPosition: number) {
    return (
      Math.ceil(
        1000 * (this.yAxis - (yPosition / this.plotHeight) * this.yAxis + 1)
      ) / 1000
    );
  }
}
