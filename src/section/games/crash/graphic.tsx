import { LegacyRef, useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { ECrashStatus } from '@/constants/status';
import {
  cn,
  formatMillisecondsShort,
  initialLabel,
  numberFormat
} from '@/utils/utils';
import { ITick } from '@/types';
import 'pixi-spine';
import { Spine } from 'pixi-spine';
import { ContainerChild } from 'pixi.js';
import { CrashEngine, CrashEngineState } from './CrashEngine.ts';
import { useGame } from '@/contexts/GameContext.tsx';

interface GraphicDisplayProps {
  crashStatus: ECrashStatus;
  crTick: ITick;
  crBust: number;
  crElapsed: number;
  prepareTime: number;
}

interface RaindropType {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  opacity: number;
  fadeSpeed: number;
}

export default function GraphicDisplay({
  crashStatus,
  crTick,
  crBust,
  crElapsed,
  prepareTime
}: GraphicDisplayProps) {
  const { gameHistories } = useGame();

  const flag = useRef<boolean>(false);
  const crBustValue = useRef<number>(crBust);
  const canvasReference = useRef<HTMLCanvasElement | undefined | null>(null);
  const explosionRef = useRef<HTMLCanvasElement | undefined | null>(null);
  const rocketRef = useRef(null);
  const flameRef = useRef<HTMLDivElement | undefined | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | undefined | null>(null);
  const canvasSize = useRef({ x: 0, y: 0 });
  const t = useRef(0);
  const timer = useRef<number | null>(null);
  const speed = useRef(5);
  // const [inputPreStart, setInputPrestart] = useState(0);
  const [explosionRect, setRect] = useState({ left: 0, top: 0 });
  const loadingPos = useRef({ x: 300, y: 450 });
  // const [engine, setEngine] = useState(null);

  var engine: CrashEngine | null = null;
  // const isComponentMounted = useRef(true);
  const yTickWidth = 2;
  const xTickWidth = 2;

  // Raindrop properties
  const raindropCount = 20;
  const raindrops: RaindropType[] = [];
  // const isResized = useRef(false);

  // Create raindrop objects
  function createRaindrops() {
    raindrops.length = 0;
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push({
        x: Math.random() * (canvasContainerRef.current?.clientWidth ?? 1366), // Random x-coordinate
        y: Math.random() * (canvasContainerRef.current?.clientHeight ?? 768), // Random y-coordinate
        length: Math.random() * 20 + 160, // Random length of the raindrop
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
        raindrop.x =
          Math.random() *
          ((canvasContainerRef.current?.clientWidth as number) ?? 1366);
        raindrop.y =
          Math.random() *
          ((canvasContainerRef.current?.clientHeight as number) ?? 768);
        raindrop.opacity = 0.3 + Math.random() * 0.4; // Reset opacity
      }
      if (
        raindrop.x >
          ((canvasContainerRef.current?.clientWidth as number) ?? 1366) ||
        raindrop.y >
          ((canvasContainerRef.current?.clientHeight as number) ?? 768) ||
        raindrop.x < 0 ||
        raindrop.y < 0
      ) {
        raindrop.x =
          Math.random() *
          ((canvasContainerRef.current?.clientWidth as number) ?? 1366);
        raindrop.y =
          Math.random() *
          ((canvasContainerRef.current?.clientHeight as number) ?? 768);
        raindrop.opacity = 0.3 + Math.random() * 0.4;
      }
    }
  }

  function drawGradientLine(line, tangent) {
    var ctx = canvasReference.current?.getContext('2d');
    if (!ctx) return;
    var angle = Math.PI / 2;
    if (engine?.state === CrashEngineState.Active) {
      if (engine.getElapsedTime() < 800) {
        // console.log(engine.getElapsedTime())
        angle =
          (-Math.PI / 2) * (1 - engine.getElapsedTime() / 800) +
          tangent * (engine.getElapsedTime() / 800);
      } else angle = tangent;
    }
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);

    var gradient: CanvasGradient | null = null;
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
    gradient.addColorStop(0, `rgba(135, 206, 235, 0)`); // Transparent at the end
    gradient.addColorStop(1, `rgba(135, 206, 235, ${line.opacity})`); // Blue with opacity

    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    if (tangent == 0) {
      ctx.lineTo(line.x, line.y + line.length);
    } else {
      ctx.lineTo(line.x - dirX * line.length, line.y - dirY * line.length);
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw raindrops
  function drawRaindrops(tangent = 0) {
    var ctx = canvasReference.current?.getContext('2d');
    if (!ctx) return;
    // ctx.clearRect(0, 0, canvasContainerRef.current?.clientWidth as number, canvasContainerRef.current?.clientHeight as number); // Clear the canvas
    ctx.strokeStyle = 'rgba(174,194,224,0.2)'; // Light blue color
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

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
    if (!canvasReference.current || !canvasContainerRef.current) {
      return;
    }

    if (!engine) return;
    if (flag.current) {
      engine.state = CrashEngineState.Over;
    }

    var ctx = canvasReference.current.getContext('2d');
    const img = rocketRef?.current;
    const flame = flameRef?.current;
    let flameFrame: CanvasImageSource | undefined = undefined;

    if (engine.state === CrashEngineState.Active) {
      // console.log(engine.elapsedTime)
      flameFrame = flame?.children[
        Number((engine.getElapsedTime() / 16).toFixed(0)) % 11
      ] as CanvasImageSource;
    } else if (engine.state === CrashEngineState.Loading) {
      flameFrame = flame?.children[
        Number((engine.getElapsedLoading() / 16).toFixed(0)) % 11
      ] as CanvasImageSource;
    }
    // console.log(engine.startTime, engine.getElapsedTime(), engine.getElapsedLoading());
    if (ctx && engine && img) {
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
      ctx.beginPath();
      ctx.strokeStyle = '#853278';
      ctx.lineWidth =
        (3 *
          (canvasSize.current.x ?? canvasContainerRef.current?.clientWidth)) /
        768;
      ctx.moveTo(0, engine.plotHeight);
      const controlY = b.y + t.current;
      ctx.quadraticCurveTo(b.x, controlY, a.x, a.y);
      ctx.stroke();

      const rocketWidth =
        (130 *
          (canvasSize.current.x ?? canvasContainerRef.current?.clientWidth)) /
        768;
      const rocketHeight =
        (80 *
          (canvasSize.current.y ?? canvasContainerRef.current?.clientHeight)) /
        576;

      if (engine.state === CrashEngineState.Active) {
        // Draw line

        ctx.save();
        //Draw Rocket
        var offsetY = -500;
        if (engine.getElapsedTime() < 800) {
          offsetY = 100 * (1 - engine.getElapsedTime() / 800);
        } else offsetY = 0;
        ctx.translate(a.x, a.y + offsetY);

        if (engine.getElapsedTime() < 800) {
          ctx.rotate((-Math.PI / 2) * (1 - engine.getElapsedTime() / 800));
        } else ctx.rotate(tangent);

        ctx.drawImage(
          img,
          -rocketWidth + 10,
          -rocketHeight / 2,
          rocketWidth,
          rocketHeight
        );
        if (flameFrame) {
          ctx.drawImage(
            flameFrame,
            -rocketWidth * 2 + 10,
            -rocketHeight / 2,
            rocketWidth,
            rocketHeight
          );
        }
        ctx.restore();
      } else if (engine.state === CrashEngineState.Loading) {
        ctx.save();
        ctx.translate(loadingPos.current.x, loadingPos.current.y);
        ctx.rotate(-Math.PI / 2);
        var posX = 0;
        var offsetX = Math.sin(engine.getElapsedLoading() / 16) * 1;

        if (Number(engine.getRemainingLoading()) < 2) {
          offsetX = 0;
          posX -=
            Math.cos(
              ((1 - Number(engine.getRemainingLoading())) * Math.PI) / 2
            ) * 50;
          // console.log(Math.cos((1 - Number(engine.getRemainingLoading())) * Math.PI / 2))
        }
        if (Number(engine.getRemainingLoading()) < 1) {
          posX +=
            Math.sin(1 - Number(engine.getRemainingLoading())) *
            Math.PI *
            canvasContainerRef.current?.clientWidth;
        }
        ctx.drawImage(img, posX + offsetX, 0, rocketWidth, rocketHeight);
        if (flameFrame)
          ctx.drawImage(
            flameFrame,
            posX - rocketWidth + offsetX,
            0,
            rocketWidth,
            rocketHeight
          );
        ctx.restore();
      } else if (engine.state === CrashEngineState.Over) {
        getBrowserPosFromCanvas(a.x, a.y);
        engine.explode = 1;
      }
      const fontSize =
        (150 *
          (canvasSize.current.y ?? canvasContainerRef.current?.clientHeight)) /
        768;
      // Draw caption
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#fff';
      var labelText = '';
      if (engine.state === CrashEngineState.Active) {
        labelText = engine.multiplier.toFixed(2) + 'x';
      } else if (engine.state === CrashEngineState.Loading) {
        labelText = Number(engine.getRemainingLoading()).toFixed(2) + 's';
      } else if (engine.state === CrashEngineState.Over) {
        ctx.fillStyle = '#EB4A4B';
        labelText = (crBustValue.current / 100).toFixed(2) + 'x';
      }
      // console.log(engine.multiplier, engine.getElapsedTime())
      if (Number(engine.getRemainingLoading()) < 0) {
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
    timer.current = requestAnimationFrame(tick);
  };

  const handleResize = () => {
    if (canvasContainerRef.current) {
      console.log(
        'canvasContainerRef.current.clientWidth',
        canvasContainerRef.current.clientWidth
      );
      console.log(
        'canvasContainerRef.current.clientHeight',
        canvasContainerRef.current.clientHeight
      );
      canvasSize.current = {
        x: canvasContainerRef.current.clientWidth,
        y: canvasContainerRef.current.clientHeight
      };
      loadingPos.current = {
        x: (300 / 1366) * canvasContainerRef.current.clientWidth,
        y: (450 / 768) * canvasContainerRef.current.clientHeight
      };
      const rect = canvasReference.current?.getBoundingClientRect();
      if (rect) setRect({ left: rect.left, top: rect.top });
      engine?.onResize(
        canvasContainerRef.current.clientWidth,
        canvasContainerRef.current.clientHeight
      );
    }
  };

  function getBrowserPosFromCanvas(canvasX, canvasY) {
    // Get the bounding rectangle of the canvas in the browser window
    if (engine?.explode == 1) return;
    const rect = canvasReference.current?.getBoundingClientRect();
    if (rect) setRect({ left: rect.left, top: rect.top });
    if (explosionRef.current) {
      const app = new PIXI.Application({
        view: explosionRef.current,
        width: canvasContainerRef.current?.clientWidth as number,
        height: canvasContainerRef.current?.clientHeight as number,
        backgroundAlpha: 0
      });

      PIXI.Assets.load('/explosion/explosions.json')
        .then((resource) => {
          const animation = new Spine(resource.spineData);
          app.stage.addChild(animation as unknown as ContainerChild);

          // add the animation to the scene and render...
          // app.stage.addChild(animation);

          if (animation.state.hasAnimation('Fx03_text')) {
            // run forever, little boy!
            animation.state.setAnimation(0, 'Fx03_text', false);
            // animation.stage.set(.5);
            // dont run too fast
            // animation.state.timeScale = 0.5;
            animation.skeleton.x = canvasX;
            animation.skeleton.y = canvasY;
            animation.spineData.width =
              (35 *
                (canvasSize.current.x ??
                  canvasContainerRef.current?.clientWidth)) /
              1024;
            animation.spineData.height =
              (45 *
                (canvasSize.current.x ??
                  canvasContainerRef.current?.clientWidth)) /
              768;

            // update yourself
            animation.autoUpdate = true;
          }
        })
        .catch((e: any) => {
          console.log('MSR error', e);
        });
    }
    // Calculate the browser relative position
  }

  const startGame = (preStartTime) => {
    createRaindrops();
    if (engine) engine.destroy();
    if (timer.current != null) {
      cancelAnimationFrame(timer.current);
    }
    t.current = 0;
    speed.current = 5;

    const newEngine = new CrashEngine();
    newEngine.onResize(
      canvasContainerRef.current?.clientWidth as number,
      canvasContainerRef.current?.clientHeight as number
    );
    newEngine.state = CrashEngineState.Loading;
    newEngine.explode = 0;

    if (preStartTime != 0) {
      newEngine.startTime = new Date().getTime() - preStartTime;
      newEngine.state = CrashEngineState.Active;
    } else newEngine.startTime = new Date().getTime() + 9000;
    engine = newEngine;

    timer.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!canvasReference.current || !canvasContainerRef.current) return;
    handleResize();
  }, [canvasReference.current, canvasContainerRef.current]);

  useEffect(() => {
    if (!canvasReference.current || !canvasContainerRef.current) return;

    // Initialize raindrops and start the animation

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasReference.current, canvasContainerRef.current]);

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      flag.current = false;
      startGame(crElapsed);
    } else if (crashStatus === ECrashStatus.END) {
      flag.current = true;
      crBustValue.current = crBust;
    } else if (crashStatus === ECrashStatus.PROGRESS) {
      startGame(crElapsed);
    }
  }, [crashStatus, crElapsed, crBust, crTick]);

  return (
    <div className="h-full w-full rounded-lg">
      <img ref={rocketRef} src="/rocket1.png" style={{ display: 'none' }} />
      <div
        ref={flameRef as LegacyRef<HTMLDivElement> | undefined}
        style={{ display: 'none' }}
      >
        {Array.from({ length: 11 }, (_, i) => (
          <img key={i} src={`/flame/${i + 1}.png`} />
        ))}
      </div>
      <div
        ref={canvasContainerRef as LegacyRef<HTMLDivElement> | undefined}
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          style={{ background: '#131528', minHeight: '250px' }}
          width={
            canvasSize.current.x ?? canvasContainerRef.current?.clientWidth
          }
          height={
            canvasSize.current.y ?? canvasContainerRef.current?.clientHeight
          }
          ref={canvasReference as LegacyRef<HTMLCanvasElement> | undefined}
        />
      </div>
      <canvas
        style={{
          background: 'transparent',
          position: 'absolute',
          left: 0,
          top: 0
        }}
        ref={explosionRef as LegacyRef<HTMLCanvasElement> | undefined}
        width={
          (60 *
            (canvasSize.current.x ?? canvasContainerRef.current?.clientWidth)) /
          1024
        }
        height={
          (80 *
            (canvasSize.current.x ?? canvasContainerRef.current?.clientWidth)) /
          768
        }
      />
      {gameHistories.length > 0 && (
        <div
          className={`absolute bottom-0 z-30 flex w-[95%] items-center justify-start overflow-x-hidden py-[8px] transition-all duration-300 ease-in-out lg:py-[16px]`}
        >
          {gameHistories.map((item, _index) => {
            return (
              <span
                key={_index}
                className={`z-20 mr-4 rounded-lg bg-[#00000033] px-[6px] py-[4px] font-bold ${item.crashPoint > 170 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                style={{ opacity: 100 - _index * 7 + '%' }}
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
