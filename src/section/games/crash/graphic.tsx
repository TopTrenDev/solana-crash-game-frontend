import { useCallback, useEffect, useRef, useState } from 'react';
import RocketPNG from '@/assets/rocket1.png';
import { ECrashStatus } from '@/constants/status';
import { ITick } from '@/types';

export enum CrashEngineState {
  Loading = 'loading',
  Active = 'active',
  Over = 'over'
}

export class CrashEngine {
  public static CrashSpeed = 0.00006;
  public static PredictingLapse = 300;

  public startTime = 0;
  public loadingTime = 6000;
  public loadStartTime = Date.now();
  public elapsedTime = 0;
  public finalElapsed = 0;
  public finalMultiplier = 0;
  public crashPoint: number | null = null;
  public betAmount = 0;
  public graphWidth = 0;
  public graphHeight = 0;
  public plotWidth = 0;
  public plotHeight = 0;
  public plotOffsetX = 0;
  public plotOffsetY = 0;
  public xAxis = 0;
  public yAxis = 0;
  public xIncrement = 0;
  public yIncrement = 0;
  public xAxisMinimum = 1000;
  public yAxisMinimum = -1;
  public elapsedOffset = 0;
  public yAxisMultiplier = 1.5;
  public multiplier = 1;
  public tickTimeout: number | null = null;
  public lag = false;
  public lastGameTick: number | null = null;
  public lagTimeout: number | null = null;
  public state = CrashEngineState.Loading;
  public checkForLag = (() => {
    this.lag = true;
  }).bind(this);

  public onResize(width: number, height: number) {
    this.graphWidth = width;
    this.graphHeight = height;
    this.plotOffsetX = 50;
    this.plotOffsetY = 40;
    this.plotWidth = width - this.plotOffsetX;
    this.plotHeight = height - this.plotOffsetY - 50;
  }

  public getElapsedPayout(elapsedTime: number) {
    const payout =
      ~~(100 * Math.pow(Math.E, CrashEngine.CrashSpeed * elapsedTime)) / 100;
    if (!isFinite(payout)) {
      throw new Error('Infinite payout');
    }
    return Math.max(payout, 1);
  }

  public tick() {
    this.elapsedTime = this.getElapsedTime();
    this.multiplier =
      this.state !== CrashEngineState.Over
        ? this.getElapsedPayout(this.elapsedTime)
        : this.finalMultiplier;
    this.yAxisMinimum = this.yAxisMultiplier;
    this.xAxis = Math.max(
      this.elapsedTime + this.elapsedOffset,
      this.xAxisMinimum
    );
    this.yAxis = Math.max(this.multiplier, this.yAxisMinimum);
    this.xIncrement = this.plotWidth / this.xAxis;
    this.yIncrement = this.plotHeight / this.yAxis;
  }

  public destroy() {
    if (this.tickTimeout) {
      clearTimeout(this.tickTimeout);
    }

    if (this.lagTimeout) {
      clearTimeout(this.lagTimeout);
    }
  }

  public getElapsedTime() {
    if (this.state === CrashEngineState.Loading) {
      return 0;
    }

    if (this.state === CrashEngineState.Over) {
      return this.finalElapsed;
    }

    if (this.state !== CrashEngineState.Active) {
      return 0;
    }
    return Date.now() - this.startTime;
  }

  public getElapsedLoading() {
    if (this.state === CrashEngineState.Loading) {
      return Date.now() - this.loadStartTime;
    }
    return 0;
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
  public getMultiplierY(multiplier: number) {
    return this.plotHeight - (multiplier - 1) * this.yIncrement;
  }
}

interface GraphicDisplayProps {
  crashStatus: ECrashStatus;
  crTick: ITick;
  crBust: number;
  crElapsed: number;
  prepareTime: number;
}

export default function Graphic({
  crashStatus,
  crTick,
  crBust,
  crElapsed,
  prepareTime
}: GraphicDisplayProps) {
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLImageElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const t = useRef(0);
  const speed = useRef(5);
  const loadingPos = { x: 300, y: 450 };

  let engine: CrashEngine | null = null;
  const [timer, setTimer] = useState<number>(0);
  const yTickWidth = 2;
  const xTickWidth = 2;

  // Raindrop properties
  const raindropCount = 45;
  const raindrops: any[] = [];

  // Create raindrop objects
  function createRaindrops() {
    raindrops.length = 0;
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * 1366, // Random x-coordinate
        y: Math.random() * 768, // Random y-coordinate
        length: Math.random() * 20 + 200, // Random length of the raindrop
        speed: speed.current, // Random speed for falling
        width: Math.random() * 2 + 1, // Random width of the raindrop
        opacity: 0.3 + Math.random() * 0.4,
        fadeSpeed: 0.005 + Math.random() * 0.01
      });
    }
  }

  // Update raindrop positions
  function updateRaindrops(tangent = 0) {
    const dirX = Math.cos(tangent);
    const dirY = Math.sin(tangent);
    for (let i = 0; i < raindrops.length; i++) {
      const raindrop = raindrops[i];
      raindrop.speed = speed.current;
      raindrop.opacity -= raindrop.fadeSpeed;

      if (tangent == 0) {
        raindrop.y += raindrop.speed;
      } else {
        raindrop.x -= dirX * raindrop.speed;
        raindrop.y -= dirY * raindrop.speed;
      }
      // if (raindrop.y > 768) {
      //   raindrop.y = -raindrop.length; // Reset raindrop position when it goes off-screen
      //   raindrop.x = Math.random() * 1366; // Randomize x-coordinate on reset
      // }
      if (raindrop.opacity <= 0) {
        // Reset the line when it's fully faded
        raindrop.x = Math.random() * 1366;
        raindrop.y = Math.random() * 768;
        raindrop.opacity = 0.3 + Math.random() * 0.4; // Reset opacity
      }
      if (
        raindrop.x > 1366 ||
        raindrop.y > 768 ||
        raindrop.x < 0 ||
        raindrop.y < 0
      ) {
        raindrop.x = Math.random() * 1366;
        raindrop.y = Math.random() * 768;
        raindrop.opacity = 0.3 + Math.random() * 0.4;
      }
    }
  }

  function drawGradientLine(line, tangent) {
    const ctx = canvasReference.current!.getContext('2d');
    if (!ctx) return;

    let angle = Math.PI / 2;
    if (engine?.state === CrashEngineState.Active) {
      const crElapsed = engine.getElapsedTime();
      if (crElapsed < 800) {
        // console.log(elapsedTime)
        angle =
          (-Math.PI / 2) * (1 - crElapsed / 800) + tangent * (crElapsed / 800);
      } else angle = tangent;
    }
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    var gradient: any = null;
    if (tangent == 0) {
      gradient = ctx.createLinearGradient(
        line.x,
        line.y,
        line.x,
        line.y + line.length
      );
    } else {
      gradient = ctx.createLinearGradient(
        line.x,
        line.y,
        line.x - dirX * line.length,
        line.y - dirY * line.length
      );
    }
    // Set the gradient from full opacity to transparent
    gradient.addColorStop(0, `rgba(35, 37, 59, 0)`); // Transparent at the end
    gradient.addColorStop(1, `rgba(35, 37, 59, ${line.opacity})`); // Blue with opacity

    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    if (tangent == 0) {
      ctx.lineTo(line.x, line.y + line.length);
    } else {
      ctx.lineTo(line.x - dirX * line.length, line.y - dirY * line.length);
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Draw raindrops
  function drawRaindrops(tangent = 0) {
    var ctx = canvasReference.current!.getContext('2d');

    // ctx.clearRect(0, 0, 1366, 768); // Clear the canvas
    ctx!.strokeStyle = 'rgba(174,194,224,0.2)'; // Light blue color
    ctx!.lineWidth = 1;
    ctx!.lineCap = 'round';

    for (let i = 0; i < raindrops.length; i++) {
      const raindrop = raindrops[i];
      drawGradientLine(raindrop, tangent);
    }
  }

  // Animation loop
  function animateRain(tangent) {
    updateRaindrops(tangent);
    drawRaindrops(tangent);
    // requestAnimationFrame(animateRain);
  }

  const stepValues = (multiplier, e = 5, n = 2) => {
    for (let i = 0.4, r = 0.1; ; ) {
      if (multiplier < i) {
        return r;
      }
      r *= n;
      i *= e;
      if (multiplier < i) {
        return r;
      }
      r *= e;
      i *= n;
    }
  };

  const getTangent = (controlPoint, endPoint) => {
    const dx = endPoint.x - controlPoint.x; // Derivative x at t = 1
    const dy = endPoint.y - controlPoint.y - t.current; // Derivative y at t = 1
    return Math.atan2(dy, dx); // Angle of the tangent in radians
  };

  const tick = () => {
    if (!canvasReference.current) {
      return;
    }

    if (!engine) return;

    if (engine.elapsedTime > 50000) {
      engine.state = CrashEngineState.Over;
    }

    var ctx = canvasReference.current.getContext('2d');
    const img = rocketRef?.current;
    const flame = flameRef?.current;
    var flameFrame: any = null;

    if (!flame) return;

    const elapsedTime = engine.getElapsedTime();
    const elapsedLoading = engine.getElapsedLoading();
    const remainingLoading = Number(engine.getRemainingLoading());

    if (engine.state === CrashEngineState.Active) {
      // console.log(engine.elapsedTime)
      const frameIndex = Math.floor(elapsedTime / 16) % 11;
      flameFrame = flame.children[frameIndex];
    } else if (engine.state === CrashEngineState.Loading) {
      const frameIndex = Math.floor(elapsedLoading / 16) % 11;
      flameFrame = flame.children[frameIndex];
    }
    // console.log(engine.startTime, elapsedTime, engine.getElapsedLoading());
    if (ctx && engine && img && flameFrame) {
      if (engine.state === CrashEngineState.Active) {
        if (engine.elapsedTime > 5000 && speed.current < 12)
          speed.current += 0.001;
        if (t.current < 100) t.current += 0.04;
        else t.current -= 0.01;
        engine.tick();
      }
      ctx.clearRect(0, 0, engine.graphWidth, engine.graphHeight);
      const a = engine.getElapsedPosition(engine.elapsedTime);
      const b = engine.getElapsedPosition(engine.elapsedTime * 0.5);

      const tangent = getTangent(b, a);

      animateRain(tangent);

      if (engine.state === CrashEngineState.Active) {
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = '#853278';
        ctx.lineWidth = 5;
        ctx.moveTo(0, engine.plotHeight);
        const controlY = b.y + t.current;
        ctx.quadraticCurveTo(b.x, controlY, a.x, a.y);
        ctx.stroke();
        ctx.save();
        //Draw Rocket
        var offsetY = -500;
        if (elapsedTime < 800) {
          // console.log(elapsedTime)
          offsetY = 100 * (1 - elapsedTime / 800);
        } else offsetY = 0;
        ctx.translate(a.x, a.y + offsetY);

        if (elapsedTime < 800) {
          // console.log(elapsedTime)
          ctx.rotate((-Math.PI / 2) * (1 - elapsedTime / 800));
        } else ctx.rotate(tangent);
        const imgWidth = 160;
        const imgHeight = 64;
        ctx.drawImage(img, -imgWidth + 10, -imgHeight / 2, imgWidth, imgHeight);
        const imgWidthF = 160;
        const imgHeightF = 64;
        ctx.drawImage(
          flameFrame,
          -imgWidth * 2 + 10,
          -imgHeight / 2,
          imgWidthF,
          imgHeightF
        );
        ctx.restore();
      } else if (engine.state === CrashEngineState.Loading) {
        ctx.save();
        ctx.translate(loadingPos.x, loadingPos.y);
        ctx.rotate(-Math.PI / 2);
        var posX = 0;
        var offsetX = Math.sin(elapsedLoading / 16) * 1;
        const imgWidth = 160;
        const imgHeight = 64;

        if (remainingLoading < 2) {
          offsetX = 0;
          posX -= Math.cos(((1 - remainingLoading) * Math.PI) / 2) * 50;
          // console.log(Math.cos((1 - remainingLoading) * Math.PI / 2))
        }
        if (remainingLoading < 1) {
          posX += Math.sin(1 - remainingLoading) * Math.PI * 300;
        }
        ctx.drawImage(img, posX + offsetX, 0, imgWidth, imgHeight);
        const imgWidthF = 160;
        const imgHeightF = 64;
        ctx.drawImage(
          flameFrame,
          posX - 160 + offsetX,
          0,
          imgWidthF,
          imgHeightF
        );
        ctx.restore();
      }

      // Draw caption
      ctx.font = 'bold 150px sans-serif';
      ctx.fillStyle = '#fff';
      var labelText = '';
      if (engine.state === CrashEngineState.Active) {
        labelText = engine.multiplier.toFixed(2) + 'x';
      } else if (engine.state === CrashEngineState.Loading) {
        labelText = remainingLoading + 's';
      } else if (engine.state === CrashEngineState.Over) {
        labelText = engine.multiplier.toFixed(2) + 'x';
      }
      // console.log(engine.multiplier, elapsedTime)
      if (remainingLoading < 0) {
        t.current = 0;
        engine.state = CrashEngineState.Active;
      }

      const textSize = ctx.measureText(labelText);
      ctx.fillText(
        labelText,
        engine.plotWidth / 2 - textSize.width / 2,
        engine.plotHeight / 2 +
          (textSize.actualBoundingBoxAscent +
            textSize.actualBoundingBoxDescent) /
            2
      );

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#222';
      ctx.strokeStyle = '#777';

      // Draw y axis
      const stepOffset = stepValues(engine.multiplier || 1);
      const stepScale = engine.plotHeight / engine.yAxis;
      const subStepOffset = stepOffset * stepScale;
      let subSteps = Math.max(
        2,
        Math.min(16, ~~(subStepOffset / Math.max(3, engine.yAxis / stepOffset)))
      );
      subSteps += subSteps % 2;

      for (
        let offset = stepOffset, step = 0;
        offset < engine.yAxis + stepOffset && step <= 100;
        offset += stepOffset, step++
      ) {
        const positionX = 0.5 + ~~engine.plotWidth + 15;
        const positionY = engine.plotHeight - offset * stepScale;

        // Draw ticker
        ctx.strokeStyle = '#444';
        ctx.lineWidth = yTickWidth;
        ctx.beginPath();
        ctx.moveTo(positionX - yTickWidth, positionY);
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
        ctx.strokeStyle = '#777';

        // Draw caption
        const labelText =
          engine
            .getYMultiplier(positionY)
            .toFixed(engine.multiplier > 2 ? 0 : 1) + 'x';
        const textSize = ctx.measureText(labelText);
        ctx.fillStyle = '#666';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(
          labelText,
          positionX + 10,
          positionY +
            (textSize.actualBoundingBoxAscent +
              textSize.actualBoundingBoxDescent) /
              2
        );

        // Draw substeps
        for (let o = 1; o < subSteps; o++) {
          const isMiddleSubStep = o === subSteps / 2;
          const subStepWidth = isMiddleSubStep ? 12 : 7;
          const subStepPositionY =
            0.5 + ~~(positionY + (subStepOffset / subSteps) * o);

          // Draw ticker
          ctx.beginPath();
          ctx.moveTo(positionX - subStepWidth, subStepPositionY);
          ctx.lineTo(positionX, subStepPositionY);
          ctx.stroke();
        }
      }

      // Draw x axis
      const xStepOffset = stepValues(engine.xAxis, 5, 2);
      const xStepScale = engine.plotWidth / (engine.xAxis / xStepOffset);

      for (
        let step = 1, offset = 0;
        offset < engine.xAxis + xStepOffset && step <= 100;
        offset += xStepOffset, step++
      ) {
        const seconds = offset / 1000;
        const positionX = step === 0 ? 4 : (step - 1) * xStepScale;
        const positionY = engine.plotHeight + 60;

        // Draw ticker
        ctx.strokeStyle = '#444';
        ctx.lineWidth = xTickWidth;
        ctx.beginPath();
        ctx.moveTo(positionX, positionY - xTickWidth / 2);
        ctx.lineTo(positionX, positionY + xTickWidth);
        ctx.stroke();
        ctx.strokeStyle = '#777';

        // Draw caption
        const labelText = seconds.toFixed(0) + 's';
        const textSize = ctx.measureText(labelText);
        ctx.fillText(labelText, positionX - textSize.width / 2, positionY + 15);
      }
    }
    setTimer(requestAnimationFrame(tick));
  };

  useEffect(() => {
    createRaindrops();
    t.current = 0;
    speed.current = 5;

    const newEngine = new CrashEngine();
    newEngine.onResize(1366, 768);
    newEngine.state = CrashEngineState.Loading; // 6s starting time
    newEngine.startTime = new Date().getTime() + 6000;

    engine = newEngine;
    setTimer(requestAnimationFrame(tick));

    return () => {
      if (timer) {
        cancelAnimationFrame(timer);
      }
      engine!.destroy();
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <img ref={rocketRef} src={RocketPNG} style={{ display: 'none' }} />
      <div ref={flameRef}>
        <img src="/flame/1.png" style={{ display: 'none' }} />
        <img src="/flame/2.png" style={{ display: 'none' }} />
        <img src="/flame/3.png" style={{ display: 'none' }} />
        <img src="/flame/4.png" style={{ display: 'none' }} />
        <img src="/flame/5.png" style={{ display: 'none' }} />
        <img src="/flame/6.png" style={{ display: 'none' }} />
        <img src="/flame/7.png" style={{ display: 'none' }} />
        <img src="/flame/8.png" style={{ display: 'none' }} />
        <img src="/flame/9.png" style={{ display: 'none' }} />
        <img src="/flame/10.png" style={{ display: 'none' }} />
        <img src="/flame/11.png" style={{ display: 'none' }} />
      </div>
      <canvas
        style={{ background: '#131528' }}
        ref={canvasReference}
        width="1366"
        height="768"
      />
    </div>
  );
}
