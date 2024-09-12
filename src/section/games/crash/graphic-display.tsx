import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import EarnedPNG from '@/assets/img/earned.png';
import RocketPNG from '@/assets/rocket1.png';
import FlameSpriteSheetPNG from '@/assets/img/flame.png';
import ChartImage from '@/assets/img/chart_bg.png';
import { ECrashStatus } from '@/constants/status';
import {
  cn,
  formatMillisecondsShort,
  initialLabel,
  numberFormat
} from '@/utils/utils';
import GrowingNumber from '../../../components/shared/growing-number';
import { ITick } from '@/types';
import { useGame } from '@/contexts';
import { CrashEngine, CrashEngineState } from '@/utils/crashEngine';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const MAX_Y = 3;
const chartBGImage = new Image();
chartBGImage.src = ChartImage;

const getGradientColor = (context: { chart: ChartJS }) => {
  const ctx = context.chart.ctx;
  const { chart } = context;
  if (!chart?.height) {
    return;
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  gradient.addColorStop(0, `#87CEEBFF`);
  gradient.addColorStop(1, `#87CEEB10`);
  return gradient;
};

interface GraphicDisplayProps {
  crashStatus: ECrashStatus;
  crTick: ITick;
  crBust: number;
  crElapsed: number;
  prepareTime: number;
}

export default function GraphicDisplay({
  crashStatus,
  crTick,
  crBust,
  crElapsed,
  prepareTime
}: GraphicDisplayProps) {
  const { gameHistories } = useGame();
  const [labels, setLabels] = useState<Array<number>>(initialLabel);
  const [yValue, setYValue] = useState<Array<number>>([]);
  const [earned, setEarned] = useState<number>(-1);

  // ==> start new ui

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

  // ==> end new ui

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
      const elapsedTime = engine.getElapsedTime();
      if (elapsedTime < 800) {
        // console.log(elapsedTime)
        angle =
          (-Math.PI / 2) * (1 - engine.getElapsedTime() / 800) +
          tangent * (engine.getElapsedTime() / 800);
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

  const tick = useCallback(() => {
    if (!canvasReference.current) {
      return;
    }

    if (!engine) return;

    if (crElapsed > 50000) {
      engine.state = CrashEngineState.Over;
    }

    var ctx = canvasReference.current.getContext('2d');
    const rocket = rocketRef?.current;
    const flame = flameRef?.current;
    var flameFrame: any = null;

    if (engine.state === CrashEngineState.Active) {
      // console.log(engine.elapsedTime)
      flameFrame =
        flame!.children[Math.floor(engine.getElapsedTime() / 16) % 11];
    } else if (engine.state === CrashEngineState.Loading) {
      flameFrame =
        flame!.children[Math.floor(engine.getElapsedLoading() / 16) % 11];
    }
    // console.log(engine.startTime, engine.getElapsedTime(), engine.getElapsedLoading());
    if (ctx && engine && rocket && flameFrame) {
      if (engine.state === CrashEngineState.Active) {
        if (crElapsed > 5000 && speed.current < 12) speed.current += 0.001;
        if (t.current < 100) t.current += 0.04;
        else t.current -= 0.01;
        engine.tick(crElapsed, crTick.cur);
      }
      ctx.clearRect(0, 0, engine.graphWidth, engine.graphHeight);
      const a = engine.getElapsedPosition(crElapsed);
      const b = engine.getElapsedPosition(crElapsed * 0.5);

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
        if (engine.getElapsedTime() < 800) {
          // console.log(engine.getElapsedTime())
          offsetY = 100 * (1 - engine.getElapsedTime() / 800);
        } else offsetY = 0;
        ctx.translate(a.x, a.y + offsetY);

        if (engine.getElapsedTime() < 800) {
          // console.log(engine.getElapsedTime())
          ctx.rotate((-Math.PI / 2) * (1 - engine.getElapsedTime() / 800));
        } else ctx.rotate(tangent);
        const imgWidth = 160;
        const imgHeight = 64;
        ctx.drawImage(
          rocket,
          -imgWidth + 10,
          -imgHeight / 2,
          imgWidth,
          imgHeight
        );
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
        var offsetX = Math.sin(engine.getElapsedLoading() / 16) * 1;
        const imgWidth = 160;
        const imgHeight = 64;

        if (Number(engine.getRemainingLoading()) < 2) {
          offsetX = 0;
          posX -=
            Math.cos(
              ((1 - Number(engine.getRemainingLoading())) * Math.PI) / 2
            ) * 50;
          // console.log(Math.cos((1 - engine.getRemainingLoading()) * Math.PI / 2))
        }
        if (Number(engine.getRemainingLoading()) < 1) {
          posX +=
            Math.sin(1 - Number(engine.getRemainingLoading())) * Math.PI * 300;
        }

        // Check if images are loaded before drawing
        if (rocket.complete && rocket.naturalHeight !== 0) {
          ctx.drawImage(rocket, posX + offsetX, 0, imgWidth, imgHeight);
        }

        const imgWidthF = 160;
        const imgHeightF = 64;

        if (flameFrame.complete && flameFrame.naturalHeight !== 0) {
          ctx.drawImage(
            flameFrame,
            posX - 160 + offsetX,
            0,
            imgWidthF,
            imgHeightF
          );
        }

        ctx.restore();
      }

      // Draw caption
      ctx.font = 'bold 150px sans-serif';
      ctx.fillStyle = '#fff';
      let labelText = '';
      // if (engine.state === CrashEngineState.Active) {
      if (crashStatus === ECrashStatus.PROGRESS) {
        labelText = crTick.cur + 'x';
        // } else if (engine.state === CrashEngineState.Loading) {
      } else if (crashStatus === ECrashStatus.PREPARE) {
        labelText = engine.getRemainingLoading() + 's';
      } else if (crashStatus === ECrashStatus.END) {
        labelText = crBust.toFixed(2) + 'x';
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
      const stepOffset = stepValues(crTick.cur || 1);
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
          engine.getYMultiplier(positionY).toFixed(crTick.cur > 2 ? 0 : 1) +
          'x';
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
  }, [crashStatus, crTick, crBust, crElapsed]);

  useEffect(() => {
    createRaindrops();
    t.current = 0;
    speed.current = 5;

    const newEngine = new CrashEngine();
    newEngine.onResize(1366, 768);
    newEngine.state = CrashEngineState.Loading;
    // if (prestartTime == 0) {
    newEngine.startTime = new Date().getTime() + 6000; // 6s starting time
    // } else {
    //   newEngine.startTime = new Date().getTime() - prestartTime;
    //   newEngine.state = CrashEngineState.Active;
    // }
    engine = newEngine;

    setTimer(requestAnimationFrame(tick));

    return () => {
      if (timer) {
        cancelAnimationFrame(timer);
      }
      engine!.destroy();
    };
    // Initialize raindrops and start the animation
  }, []);

  const graphColor = '#FFFFFF';

  const [data, setData] = useState({
    labels: initialLabel(),
    datasets: [
      {
        label: '',
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        borderColor: graphColor,
        borderWidth: 3,
        data: yValue,
        backgroundColor: getGradientColor,
        lineTension: 0.8,
        fill: true
      }
    ]
  });

  const config = {
    options: {
      layout: {
        padding: {
          top: 30,
          bottom: 60,
          right: 30
        }
      },
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true, mode: 'nearest' },
        rocket: {
          dash: [2, 2],
          color: '#fff',
          width: 3
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: 'white',
            autoSkip: true,
            display: false
          }
        },
        y: {
          grid: { display: false },
          position: 'right',
          labels: {
            align: 'high', // Align labels to the top of the axis
            fontColor: 'white', // Change font color to white
            fontSize: 12 // Change font size
          },
          ticks: {
            color: 'white',
            callback: function (value: string) {
              return numberFormat(Number(value), 2) + 'x';
            },
            markW: 5,
            markWScale: 6,
            markStepSize: 2,
            maxTicks: 4,
            minTicks: 4,
            minStepSize: 1,
            stepSize: 2
          },
          min: 1,
          max:
            yValue[yValue.length - 1] >= MAX_Y
              ? yValue[yValue.length - 1]
              : MAX_Y
        }
      }
    },
    plugins: [
      {
        id: 'rocket',
        beforeDraw: (chart: ChartJS) => {
          // Draw the background image
          if (chartBGImage.complete) {
            const ctx = chart.ctx;
            ctx.drawImage(chartBGImage, 0, 0, chart.width, chart.height);
          } else {
            chartBGImage.onload = () => chart.draw();
          }
        },
        afterDatasetsDraw: (chart: ChartJS) => {
          const { ctx, scales } = chart;

          // Get the last Y value from the chart data
          let lastYValue: number = chart.data.datasets[0].data[
            chart.data.datasets[0].data.length - 1
          ] as number;
          if (!lastYValue) lastYValue = 0;

          // becoming red color
          ctx.fillStyle = `rgba(0, 0, 0, 0.1)`; // Adjust the alpha (last parameter) for the desired transparency

          ctx.fillRect(0, 0, chart.width, chart.height);

          const lastXValue = chart.data.datasets[0].data.length - 1;

          // console.log('>>>>>', chart.data.datasets[0].data);
          // console.log('x', lastXValue);
          // console.log('y', lastYValue);

          // Draw the rocket at its new position
          const xP = scales.x.getPixelForValue(lastXValue);
          const yP = scales.y.getPixelForValue(lastYValue);

          const time =
            (0.99 * (20000 - 1000) * (lastYValue - 0.99)) / lastYValue;
          const dydt =
            (0.99 * (1000 - 20000)) / Math.pow(1000 - 20000 + time, 1);
          const angle = (Math.atan(dydt) / 3.14) * 180 - 30;

          drawRocket(ctx, xP, yP, angle);
          drawFlameAnimation(ctx, xP, yP, angle, scales);
        }
      }
    ]
  };

  // Function to draw the rocket image at a specific position
  const drawRocket = (
    ctx: CanvasRenderingContext2D | null,
    x: number,
    y: number,
    angle: number
  ) => {
    const rocketImage = new Image();
    rocketImage.src = RocketPNG;
    const rocketWidth = window.innerWidth > 500 ? 150 : 50;
    const rocket = {
      src: rocketImage,
      width: rocketWidth,
      height: rocketWidth,
      rotationAngle: 90 - angle
    };
    if (!y) return;
    // Clear the canvas
    if (ctx) {
      ctx.save(); // Save the current canvas state
      ctx.translate(x, y); // Move the canvas origin to the rocket position
      ctx.rotate((rocket.rotationAngle * Math.PI) / 180); // Rotate the canvas
      // Draw the rocket at its new position (0, 0 in the rotated coordinate system)
      ctx.drawImage(
        rocket.src,
        -rocket.width / 2,
        -rocket.height / 2,
        rocket.width,
        rocket.height
      );
      ctx.restore();
    }
  };

  const drawFlameAnimation = (
    ctx: CanvasRenderingContext2D | null,
    x: number,
    y: number,
    angle: number,
    // eslint-disable-next-line
    scales: { [x: string]: any; y?: any }
  ) => {
    const flameImage = new Image();
    flameImage.src = FlameSpriteSheetPNG; // Replace with the path to your flame sprite sheet

    const flame = {
      spriteSheet: flameImage,
      frameWidth: 157, // Adjust according to your sprite sheet
      frameHeight: 203, // Adjust according to your sprite sheet
      totalFrames: 13, // Adjust according to your sprite sheet
      currentFrame: 0,
      rotationAngle: 90 - angle
    };

    if (!ctx) {
      return;
    }

    const frameWidth = window.innerWidth > 500 ? 50 : 20;

    // Flame animation parameters
    let flameWidth = frameWidth; // Adjust according to your layout
    let flameHeight = frameWidth; // Adjust according to your layout

    if (y < scales.y.getPixelForValue(MAX_Y + 0.5)) {
      flameWidth *= 1.2;
      flameHeight *= 1.2;
    }
    // Calculate the current frame
    const currentFrame = Math.floor((Math.random() * 10) % flame.totalFrames);

    // ctx.drawImage(flame.spriteSheet, 0, 0, 157, 203, -20, 10, 30, 30)
    // Draw the flame animation`
    ctx.save(); // Save the current canvas state
    ctx.translate(
      window.innerWidth > 500 ? x : x + 12,
      window.innerWidth > 500 ? y : y - 8
    ); // Move the canvas origin to the rocket position
    ctx.rotate((flame.rotationAngle * Math.PI) / 180); // Rotate the canvas

    ctx.drawImage(
      flame.spriteSheet,
      0,
      currentFrame * flame.frameHeight + 15,
      flame.frameWidth,
      flame.frameHeight,
      -flameWidth / 2 - 2,
      -flameHeight / 2 + 40,
      flameWidth,
      flameHeight
    );
    ctx.restore();
  };

  useEffect(() => {
    const growthFunc = (ms: number) =>
      Math.floor(100 * Math.pow(Math.E, 0.00006 * ms));
    const calculateGamePayout = (ms: number): number => {
      const gamePayout = Math.floor(100 * growthFunc(ms)) / 100;
      return Math.max(gamePayout, 1);
    };

    if (yValue.length === 0) {
      let yArray: number[] = [];
      for (let i = crElapsed; i > 0; i -= 158) {
        const point = calculateGamePayout(i) / 100;
        yArray.push(point);
      }
      setYValue(yArray.reverse());
    } else {
      setYValue((values) => [...values, crTick.cur]);
    }
  }, [crTick.cur, crElapsed]);

  useEffect(() => {
    if (crashStatus === ECrashStatus.END) {
      setTimeout(() => {
        setData({
          labels: labels,
          datasets: [
            {
              label: '',
              pointBorderWidth: 0,
              pointHoverRadius: 0,
              borderColor: graphColor,
              borderWidth: 3,
              data: [],
              backgroundColor: getGradientColor,
              lineTension: 0,
              fill: true
            }
            // {
            //   label: '',
            //   pointBorderWidth: 0,
            //   pointHoverRadius: 0,
            //   borderColor: graphColor,
            //   borderWidth: 0,
            //   data: [1, MAX_Y]
            // }
          ]
        });
        setEarned(-1);
        setLabels(initialLabel);
        setYValue([]);
      }, 1000);
    } else {
      const updateState = {
        labels: labels,
        datasets: [
          {
            label: '',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 2,
            data: yValue,
            backgroundColor: getGradientColor,
            lineTension: 0,
            pointStyle: false,
            fill: true
          }
        ]
      };

      if (labels.length < yValue.length) {
        setLabels((t) => [...t, yValue.length]);
      }

      setData(updateState);

      if (yValue.length === 0) {
        setLabels(initialLabel);

        setEarned(-1);
      }
    }
  }, [crashStatus, yValue.length, labels.length]);

  return (
    <div className="h-full w-full rounded-lg">
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
        {/* <div className={`relative h-full w-full`}>
          {crashStatus === ECrashStatus.NONE && (
            <div className="crash-status-shadow absolute top-10 flex w-full flex-col items-center justify-center gap-5">
              <div className="text-[12px] font-extrabold uppercase text-[#fff] delay-100 xl:text-6xl">
                Starting...
              </div>
            </div>
          )}
          {(crashStatus === ECrashStatus.PROGRESS ||
            crashStatus === ECrashStatus.END) && (
            <div className="crash-status-shadow absolute left-[35%] top-10 flex w-[100px] flex-col items-center gap-2 lg:left-0 lg:w-full">
              <div className={`font-semibold text-[#fff]`}>
                {crashStatus === ECrashStatus.PROGRESS
                  ? 'Current payout'
                  : 'Crashed'}
              </div>
              <div
                className={cn(
                  'w-full justify-center text-center text-[15px] font-extrabold md:text-6xl',
                  crashStatus === ECrashStatus.END && 'crashed-value'
                )}
                style={{
                  color:
                    crashStatus === ECrashStatus.END
                      ? '#ff2f51'
                      : `rgb(255, ${Math.max(Number((1 - crTick.cur / 20) * 255), 0)}, ${Math.max(Number((1 - crTick.cur / 20) * 255), 0)} )`
                }}
              >
                {crashStatus === ECrashStatus.END ? (
                  <>@{(crBust / 100).toFixed(2)}x</>
                ) : (
                  <>
                    <GrowingNumber start={crTick.prev} end={crTick.cur} />x
                  </>
                )}
              </div>
            </div>
          )}
          {crashStatus === ECrashStatus.PREPARE && prepareTime > 0 && (
            <div className="crash-status-shadow absolute left-[35%] top-10 flex w-[100px] flex-col items-center justify-center gap-5 lg:left-0 lg:w-full">
              <div className="text-center text-[10px] font-semibold uppercase text-white md:text-xl">
                preparing round
              </div>
              <div className="bg-gradient-to-r from-[#9E00FF] to-[#14F195] bg-clip-text text-center text-[12px] font-extrabold uppercase text-transparent text-white delay-100 md:text-6xl">
                starting in {formatMillisecondsShort(prepareTime)}
              </div>
            </div>
          )}
          <div
            className={`absolute flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out  ${
              earned > 0 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <div className="absolute flex h-full w-full items-center justify-center">
              <img src={EarnedPNG} width={300} />
            </div>
            <div className="absolute flex h-full w-full items-center justify-center">
              <label className="text-[4rem] font-bold text-[#f8e855]">
                Earned {earned}
              </label>
            </div>
          </div>
          {gameHistories.length > 0 && (
            <div
              className={`absolute bottom-0 flex w-full items-center justify-start overflow-hidden px-[12px] py-[8px] opacity-100 transition-all duration-300 ease-in-out lg:px-[24px] lg:py-[16px]`}
            >
              {gameHistories.map((item, _index) => {
                return (
                  <span
                    key={_index}
                    className={`mr-4 rounded-lg bg-[#00000033] px-[6px] py-[4px] font-bold ${item.crashPoint > 170 ? 'text-[#14F195]' : 'text-[#E83035]'}`}
                    style={{ opacity: 100 - _index * 7 + '%' }}
                  >
                    {(item.crashPoint / 100).toFixed(2)}x
                  </span>
                );
              })}
            </div>
          )}

          <Line
            className="w-full rounded-lg bg-[#463E7A] p-2"
            data={data}
            {...(config as object)}
          />
        </div> */}
      </div>
    </div>
  );
}
