import { useEffect, useState } from 'react';
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
import RocketPNG from '@/assets/img/rocket.png';
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
import { useAppSelector } from '@/store/redux';
import { useGame } from '@/contexts';

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
        <div className={`relative h-full w-full`}>
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
        </div>
      </div>
    </div>
  );
}
