import { useCallback, useEffect, useRef, useState } from 'react';
import RocketPNG from '@/assets/rocket1.png';
import { ECrashStatus } from '@/constants/status';
import { ITick } from '@/types';
import { CrashEngine } from './useCrashEngine';
import { useGame } from '@/contexts';

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
  const { gameHistories } = useGame();
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLImageElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const t = useRef(0);
  const speed = useRef(5);
  const loadingPos = { x: 300, y: 450 };
  const flag = useRef<boolean>(false);
  const justStarted = useRef<boolean>(false);
  const crElapsedTime = useRef<number>(crElapsed);
  const crBustValue = useRef<number>(crBust);

  const engine: CrashEngine = new CrashEngine();
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<number | null>(null); // Ref to store the requestAnimationFrame ID

  const yTickWidth = 2;
  const xTickWidth = 2;

  // Raindrop properties
  let raindrops: any[] = [];

  // Create raindrop objects
  function createRaindrops() {
    raindrops.length = 0;
    for (let i = 0; i < 45; i++) {
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
    const ctx = canvasReference.current?.getContext('2d');
    if (!ctx) return;

    // Calculate the angle based on engine state and elapsed time
    const crElapsed = engine?.getElapsedTime() ?? 0;
    const angle =
      crElapsed < 800
        ? (-Math.PI / 2) * (1 - crElapsed / 800) + tangent * (crElapsed / 800)
        : tangent;

    // Calculate direction based on angle
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    // Create gradient based on the calculated direction
    const gradient = ctx.createLinearGradient(
      line.x,
      line.y,
      line.x - dirX * line.length,
      line.y - dirY * line.length
    );

    // Define gradient color stops
    const colorBase = 'rgba(35, 37, 59,';
    gradient.addColorStop(0, `${colorBase} 0)`); // Transparent at the end
    gradient.addColorStop(1, `${colorBase} ${line.opacity})`); // Blue with opacity

    // Draw the line with the gradient
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x - dirX * line.length, line.y - dirY * line.length);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4; // Consider making this a constant if it doesn't change
    ctx.stroke();
  }

  // Draw raindrops
  function drawRaindrops(tangent = 0) {
    const ctx = canvasReference.current?.getContext('2d');
    if (!ctx) return;

    // Set common properties for all raindrops
    ctx.strokeStyle = 'rgba(174,194,224,0.2)'; // Light blue color
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    // Draw each raindrop
    raindrops.forEach((raindrop) => {
      drawGradientLine(raindrop, tangent);
    });
  }

  // Animation loop
  function animateRain(tangent) {
    updateRaindrops(tangent);
    drawRaindrops(tangent);
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

  const tick = useCallback(() => {
    if (flag.current === true) {
      engine.state = ECrashStatus.END;
    }

    const ctx = canvasReference.current?.getContext('2d');
    if (!ctx || !rocketRef.current || !flameRef.current) return;

    // Clear the canvas for new drawing
    ctx.clearRect(0, 0, engine.graphWidth, engine.graphHeight);

    const rocketObject = rocketRef.current;
    const flame = flameRef.current;

    // const elapsedTime = crElapsedTime.current;
    const elapsedTime = engine.getElapsedTime();
    const elapsedLoading = engine.getElapsedLoading();
    const remainingLoading = Number(engine.getRemainingLoading());
    const a = engine.getElapsedPosition(elapsedTime);
    const b = engine.getElapsedPosition(elapsedTime * 0.5);
    const tangent = getTangent(b, a);
    const frameIndex =
      Math.floor(
        engine.state === ECrashStatus.PROGRESS
          ? elapsedTime
          : elapsedLoading / 16
      ) % 11;
    const flameFrame = flame.children[frameIndex];

    if (flameFrame) {
      if (engine.state === ECrashStatus.PROGRESS) {
        if (engine.elapsedTime > 5000 && speed.current < 12)
          speed.current += 0.001;
        if (t.current < 100) t.current += 0.04;
        else t.current -= 0.01;
        engine.gameTick();
      }

      animateRain(tangent);

      const imgWidth = 160;
      const imgHeight = 64;
      const halfImgHeight = imgHeight / 2;
      const doubleImgWidth = imgWidth * 2;

      if (engine.state === ECrashStatus.PROGRESS) {
        drawActiveState(
          ctx,
          rocketObject,
          flameFrame,
          a,
          b,
          tangent,
          elapsedTime,
          imgWidth,
          imgHeight,
          halfImgHeight,
          doubleImgWidth,
          engine.plotHeight
        );
      } else if (engine.state === ECrashStatus.PREPARE) {
        drawLoadingState(
          ctx,
          rocketObject,
          flameFrame,
          loadingPos,
          elapsedLoading,
          remainingLoading,
          imgWidth,
          imgHeight
        );
      }

      drawCaption(ctx, engine, remainingLoading);

      drawAxes(ctx, engine);
    }
    setTimer(requestAnimationFrame(tick));
  }, [crashStatus, crElapsed, prepareTime, crTick]);

  function drawAxes(ctx, engine) {
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#222';
    ctx.strokeStyle = '#777';

    drawYAxis(ctx, engine);
    drawXAxis(ctx, engine);
  }

  // Extracted x-axis drawing logic
  function drawXAxis(ctx, engine) {
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

      drawXAxisTick(ctx, positionX, positionY, xTickWidth, seconds);
    }
  }

  function drawXAxisTick(ctx, positionX, positionY, xTickWidth, seconds) {
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

  // Extracted y-axis drawing logic
  function drawYAxis(ctx, engine) {
    const stepOffset = stepValues(engine.multiplier || 1);
    const stepScale = engine.plotHeight / engine.yAxis;
    const subStepOffset = stepOffset * stepScale;
    let subSteps = Math.max(
      2,
      Math.min(16, ~~(subStepOffset / Math.max(3, engine.yAxis / stepOffset)))
    );
    subSteps += subSteps % 2;

    const positionX = 0.5 + ~~engine.plotWidth + 15;
    for (let step = 0; step <= 100; step++) {
      const offset = stepOffset * (step + 1);
      if (offset >= engine.yAxis + stepOffset) break;

      const positionY = engine.plotHeight - offset * stepScale;
      drawYAxisTick(
        ctx,
        positionX,
        positionY,
        yTickWidth,
        engine,
        subSteps,
        subStepOffset
      );
    }
  }

  function drawYAxisTick(
    ctx,
    positionX,
    positionY,
    yTickWidth,
    engine,
    subSteps,
    subStepOffset
  ) {
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
      engine.getYMultiplier(positionY).toFixed(engine.multiplier > 2 ? 0 : 1) +
      'x';
    const textSize = ctx.measureText(labelText);
    ctx.fillStyle = '#666';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(
      labelText,
      positionX + 10,
      positionY +
        (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) /
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

  // Extracted drawing logic for active state
  function drawActiveState(
    ctx,
    rocketObject,
    flameFrame,
    a,
    b,
    tangent,
    elapsedTime,
    imgWidth,
    imgHeight,
    halfImgHeight,
    doubleImgWidth,
    plotHeight
  ) {
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#853278';
    ctx.lineWidth = 5;
    ctx.moveTo(0, plotHeight);
    const controlY = b.y + t.current;
    ctx.quadraticCurveTo(b.x, controlY, a.x, a.y);
    ctx.stroke();
    ctx.save();

    // Draw Rocket
    let offsetY = elapsedTime < 800 ? 100 * (1 - elapsedTime / 800) : 0;
    ctx.translate(a.x, a.y + offsetY);
    ctx.rotate(
      elapsedTime < 800 ? (-Math.PI / 2) * (1 - elapsedTime / 800) : tangent
    );
    ctx.drawImage(
      rocketObject,
      -imgWidth + 10,
      -halfImgHeight,
      imgWidth,
      imgHeight
    );
    ctx.drawImage(
      flameFrame,
      -doubleImgWidth + 10,
      -halfImgHeight,
      imgWidth,
      imgHeight
    );
    ctx.restore();
  }

  // Extracted drawing logic for loading state
  function drawLoadingState(
    ctx,
    rocketObject,
    flameFrame,
    loadingPos,
    elapsedLoading,
    remainingLoading,
    imgWidth,
    imgHeight
  ) {
    ctx.save();
    ctx.translate(loadingPos.x, loadingPos.y);
    ctx.rotate(-Math.PI / 2);
    let offsetX = remainingLoading < 2 ? 0 : Math.sin(elapsedLoading / 16);
    let posX =
      remainingLoading < 1 ? Math.sin(1 - remainingLoading) * Math.PI * 300 : 0;
    posX -=
      remainingLoading < 2
        ? Math.cos(((1 - remainingLoading) * Math.PI) / 2) * 50
        : 0;
    ctx.drawImage(rocketObject, posX + offsetX, 0, imgWidth, imgHeight);
    ctx.drawImage(
      flameFrame,
      posX - imgWidth + offsetX,
      0,
      imgWidth,
      imgHeight
    );
    ctx.restore();
  }

  // Extracted caption drawing logic
  function drawCaption(ctx, engine, remainingLoading) {
    ctx.font = 'bold 150px sans-serif';
    ctx.fillStyle = '#fff';
    let labelText = '';
    switch (engine.state) {
      case ECrashStatus.PROGRESS:
        labelText = engine.multiplier.toFixed(2) + 'x';
        break;
      case ECrashStatus.END:
        labelText = (crBustValue.current / 100).toFixed(2) + 'x';
        break;
      case ECrashStatus.PREPARE:
        labelText = remainingLoading.toFixed(2) + 's';
        break;
    }

    if (remainingLoading < 0) {
      t.current = 0;
      engine.state = ECrashStatus.PROGRESS;
    }

    const textSize = ctx.measureText(labelText);
    ctx.fillText(
      labelText,
      engine.plotWidth / 2 - textSize.width / 2,
      engine.plotHeight / 2 +
        (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) /
          2
    );
  }

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      flag.current = false;
      createRaindrops();
      t.current = 0;
      speed.current = 5;

      engine.onResize(672, 416);

      engine.startTime = new Date().getTime() + 8000; // 6s starting time
      engine.state = ECrashStatus.PREPARE;
      timerRef.current = requestAnimationFrame(tick);
      setTimer(timerRef.current);
    } else if (crashStatus === ECrashStatus.END) {
      flag.current = true;
      crBustValue.current = crBust;
      // if (timerRef.current !== null) {
      //   console.log('I am calling');
      //   cancelAnimationFrame(timerRef.current);
      //   timerRef.current = null; // Reset the ref after canceling
      // }
      // if (timer) cancelAnimationFrame(timer);
      // if (engine) {
      //   engine.state = crashStatus;
      // }
    } else if (crashStatus === ECrashStatus.PROGRESS) {
      engine.elapsedTime = crElapsed;
      flag.current = false;

      if (justStarted.current === false) {
        justStarted.current = true;
        createRaindrops();
        t.current = 0;
        speed.current = 5;

        engine.onResize(672, 416);

        engine.startTime = new Date().getTime() - crElapsed; // 6s starting time
        engine.state = ECrashStatus.PROGRESS;
        timerRef.current = requestAnimationFrame(tick);
        setTimer(timerRef.current);
      }
    }
  }, [crashStatus, crElapsed, crBust, crTick]);

  useEffect(() => {
    crElapsedTime.current = crElapsed;
  }, [crElapsed]);

  return (
    <div className="relative h-full w-full">
      <img ref={rocketRef} src={RocketPNG} style={{ display: 'none' }} />
      <div ref={flameRef} style={{ display: 'none' }}>
        {Array.from({ length: 11 }, (_, i) => (
          <img key={i} src={`/flame/${i + 1}.png`} />
        ))}
      </div>
      <canvas
        style={{ background: '#191939' }}
        ref={canvasReference}
        width="672"
        height="416"
      />
      {gameHistories.length > 0 && (
        <div
          className={`absolute bottom-0 flex w-full items-center justify-start overflow-hidden px-[12px] py-[8px] opacity-100 transition-all duration-300 ease-in-out lg:px-[24px] lg:py-[16px]`}
        >
          {gameHistories.map((item, _index) => {
            return (
              <span
                key={_index}
                className={`mr-4 rounded-lg bg-[#00000033] px-[6px] py-[4px] font-bold ${item.crashPoint > 170 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                style={{ opacity: 100 - _index * 6 + '%' }}
              >
                {(item.crashPoint / 100).toFixed(2)}x
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
