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

import BoomPNG from '@/assets/img/boom.png';
import EarnedPNG from '@/assets/img/earned.png';
import RocketPNG from '@/assets/img/rocket.webp';
import FlameSpriteSheetPNG from '@/assets/img/flame.png';
import ChartImage from '@/assets/img/chart_bg.jpg';
import { Socket, io } from 'socket.io-client';
import { getAccessToken } from '@/utils/axios';
import {
  ECrashSocketEvent,
  ICrashClientToServerEvents,
  ICrashServerToClientEvents
} from '@/types/crash';
import { ECrashStatus } from '@/constants/status';
import { BetType, CrashHistoryData, FormattedPlayerBetType } from '@/types';
import useToast from '@/hooks/use-toast';
import {
  formatMillisecondsShort,
  initialLabel,
  numberFormat
} from '@/utils/utils';
import GrowingNumber from './growing-number';

// import { getTangentAngle } from '@/utils';
// import { q, aM } from 'chart.js/dist/chunks/helpers.core';

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

const MAX_Y = 1.956;
const chartBGImage = new Image();
chartBGImage.src = ChartImage;

const getGradintColor = (context: { chart: ChartJS }) => {
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

export default function GraphicDisplay() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [labels, setLabels] = useState<Array<number>>(initialLabel);
  const [yValue, setYValue] = useState<Array<number>>([]);
  const [earned, setEarned] = useState<number>(-1);

  const [crashHistory, setCrashHistory] = useState<
    Array<{ value: number; color: string }>
  >([]);

  const [socket, setSocket] = useState<Socket | null>(null);

  const [crTick, setCrTick] = useState({ prev: 1, cur: 1 });
  const [prepareTime, setPrepareTime] = useState(0);
  const [crashStatus, setCrashStatus] = useState<ECrashStatus>(
    ECrashStatus.NONE
  );

  const [betData, setBetData] = useState<BetType[]>([]);
  const [betCashout, setBetCashout] = useState<BetType[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState<any>();
  const [crashHistoryData, setCrashHistoryData] = useState<CrashHistoryData[]>(
    []
  );
  const [downIntervalId, setDownIntervalId] = useState(0);

  const toast = useToast();

  const graphColor = '#FFFFFF';

  const [data, setData] = useState({
    labels: initialLabel(),
    datasets: [
      {
        label: '',
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        borderColor: graphColor,
        borderWidth: 6,
        data: yValue,
        backgroundColor: getGradintColor,
        lineTension: 0.8,
        fill: true
      },
      {
        label: '',
        pointBorderWidth: 0,
        pointHoverRadius: 0,
        borderColor: graphColor,
        borderWidth: 0,
        data: [1, MAX_Y]
      }
    ]
  });

  const config = {
    options: {
      layout: {
        padding: {
          right: 50,
          top: 20,
          bottom: 25
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
            markW: 10,
            markWScale: 2,
            markStepSize: 2,
            maxTicks: 4,
            minTicks: 2,
            minStepSize: 1,
            stepSize: 1
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
          const alpha = 0.6;
          ctx.fillStyle = `rgba(255, 0, 0, ${Math.min((alpha * lastYValue) / 20, 0.6)})`; // Adjust the alpha (last parameter) for the desired transparency
          ctx.fillRect(0, 0, chart.width, chart.height);

          const lastXValue = chart.data.datasets[0].data.length - 1;

          // Draw the rocket at its new position
          const xP = scales.x.getPixelForValue(lastXValue);
          const yP = scales.y.getPixelForValue(lastYValue);

          const time =
            (0.99 * (20000 - 1000) * (lastYValue - 0.99)) / lastYValue;
          const dydt =
            (0.99 * (1000 - 20000)) / Math.pow(1000 - 20000 + time, 1);
          const angle = (Math.atan(dydt) / 3.14) * 180 - 30;

          drawRocket(ctx, xP, yP, angle);
          drawFlameAnimation(
            ctx,
            scales.x.getPixelForValue(lastXValue),
            scales.y.getPixelForValue(lastYValue as number),
            angle,
            scales
          );
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
    const rocket = {
      src: rocketImage,
      width: 50,
      height: 90,
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

    // Flame animation parameters
    const frameWidth = 157; // Adjust according to your sprite sheet
    const frameHeight = 203; // Adjust according to your sprite sheet
    const totalFrames = 13; // Adjust according to your sprite sheet
    let flameWidth = 50; // Adjust according to your layout
    let flameHeight = 50; // Adjust according to your layout

    if (y < scales.y.getPixelForValue(MAX_Y + 0.5)) {
      flameWidth *= 1.2;
      flameHeight *= 1.2;
    }
    // Calculate the current frame
    const currentFrame = Math.floor((Math.random() * 10) % totalFrames);

    // ctx.drawImage(flame.spriteSheet, 0, 0, 157, 203, -20, 10, 30, 30)
    // Draw the flame animation`
    ctx.save(); // Save the current canvas state
    ctx.translate(x, y); // Move the canvas origin to the rocket position
    ctx.rotate((flame.rotationAngle * Math.PI) / 180); // Rotate the canvas

    ctx.drawImage(
      flame.spriteSheet,
      0,
      currentFrame * frameHeight + 15,
      frameWidth,
      frameHeight,
      -flameWidth / 2 - 2,
      -flameHeight / 2 + 40,
      flameWidth,
      flameHeight
    );
    ctx.restore();
  };

  useEffect(() => {
    setYValue((values) => [...values, Number(crTick.cur)]);
  }, [crTick]);

  useEffect(() => {
    if (crashStatus === ECrashStatus.END) {
      setData({
        labels: labels,
        datasets: [
          {
            label: '',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 6,
            data: [],
            backgroundColor: getGradintColor,
            lineTension: 0.8,
            fill: true
          },
          {
            label: '',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 0,
            data: [1, MAX_Y]
          }
        ]
      });
      setEarned(-1);
      setLabels(initialLabel);
      setYValue([]);
    } else {
      const updateState = {
        labels: labels,
        datasets: [
          {
            label: '',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 6,
            data: yValue,
            backgroundColor: getGradintColor,
            lineTension: 0.8,
            fill: true
          },
          {
            label: '',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            borderColor: graphColor,
            borderWidth: 0,
            data: [1, MAX_Y]
          }
        ]
      };

      if (labels.length < yValue.length) {
        setLabels((t) => [...t, yValue.length]);
      }

      setData(updateState);

      if (yValue.length === 0) {
        if (crTick.cur > 1) {
          const newChatHistory = {
            value: Number(numberFormat(crTick.cur, 2)),
            color: crTick.cur > 1.7 ? '#14F195' : '#E83035'
          };
          setCrashHistory((v) => [...v, newChatHistory]);
        }
        setLabels(initialLabel);

        setEarned(-1);
      }
    }
  }, [crashStatus, yValue.length, labels.length]);

  const updatePrepareCountDown = () => {
    setPrepareTime((prev) => prev - 100);
  };

  useEffect(() => {
    if (socket) {
      socket.emit('auth', getAccessToken());
    }
  }, [getAccessToken()]);

  useEffect(() => {
    const crashSocket: Socket<
      ICrashServerToClientEvents,
      ICrashClientToServerEvents
    > = io(`${SERVER_URL}/crash`);

    crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 5 as any);

    crashSocket.on(ECrashSocketEvent.GAME_TICK, (tick) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick((prev) => ({
        prev: prev.cur,
        cur: tick
      }));
    });

    crashSocket.on(ECrashSocketEvent.GAME_STARTING, (data) => {
      setCrashStatus(ECrashStatus.PREPARE);
      setPrepareTime(data.timeUntilStart ?? 0);
      // stopCrashBgVideo();
      setBetData([]);
      setBetCashout([]);
      setTotalAmount({
        usk: 0,
        kuji: 0
      });
    });

    crashSocket.on(ECrashSocketEvent.GAME_START, (data) => {
      setCrashStatus(ECrashStatus.PROGRESS);
      setCrTick({ prev: 1, cur: 1 });
      // playCrashBgVideo();
    });

    crashSocket.on(
      ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY,
      (historyData: any) => {
        setCrashHistoryData(historyData);
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_END, (data) => {
      setCrashStatus(ECrashStatus.END);
      // stopCrashBgVideo();
      // setAvaliableBet(false);

      crashSocket.emit(ECrashSocketEvent.PREVIOUS_CRASHGAME_HISTORY, 10 as any);
    });

    crashSocket.on(
      ECrashSocketEvent.GAME_BETS,
      (bets: FormattedPlayerBetType[]) => {
        setBetData((prev: BetType[]) => [...bets, ...prev]);
        const totalUsk = bets
          .filter((bet) => bet.denom === 'usk')
          .reduce((acc, item) => acc + item.betAmount, 0);

        const totalKuji = bets
          .filter((bet) => bet.denom === 'kuji')
          .reduce((acc, item) => acc + item.betAmount, 0);

        setTotalAmount((prevAmounts) => ({
          usk: (prevAmounts?.usk || 0) + totalUsk,
          kuji: (prevAmounts?.kuji || 0) + totalKuji
        }));
      }
    );

    crashSocket.on(ECrashSocketEvent.GAME_JOIN_ERROR, (data) => {
      toast.error(data);
      // setAutoBet(true);
    });

    crashSocket.on(ECrashSocketEvent.CRASHGAME_JOIN_SUCCESS, (data) => {
      // setAvaliableBet(true);
    });

    crashSocket.on(ECrashSocketEvent.BET_CASHOUT, (data) => {
      setBetCashout((prev) => [...prev, data?.userdata]);
    });

    crashSocket.emit('auth', getAccessToken());

    setSocket(crashSocket);
    return () => {
      crashSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (crashStatus === ECrashStatus.PREPARE) {
      const intervalId = window.setInterval(updatePrepareCountDown, 100);
      setDownIntervalId(intervalId);
    } else {
      clearInterval(downIntervalId);
    }
  }, [crashStatus]);

  return (
    <div className="h-full rounded-lg">
      <div className="relative h-full">
        <div className={`relative h-full`}>
          {crashStatus === ECrashStatus.NONE && (
            <div className="crash-status-shadow absolute left-[30%] top-[40%] flex flex-col items-center justify-center gap-5">
              <div className=" text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
                Starting...
              </div>
            </div>
          )}
          {(crashStatus === ECrashStatus.PROGRESS ||
            crashStatus === ECrashStatus.END) && (
            <label
              className={`absolute z-50 flex h-full w-full flex-col items-center justify-start py-8 text-[4rem] font-bold`}
            >
              <span className="text-[16px] font-medium text-white">
                Current payout
              </span>
              <span
                style={{
                  color: `rgb(255, ${Math.max(Number((1 - crTick.cur / 20) * 255), 0)}, ${Math.max(
                    Number((1 - crTick.cur / 20) * 255),
                    0
                  )} )`
                }}
              >
                <GrowingNumber start={crTick.prev} end={crTick.cur} />x
              </span>
            </label>
          )}
          {crashStatus === ECrashStatus.PREPARE && prepareTime > 0 && (
            <div className="crash-status-shadow absolute left-[20%] top-[40%] flex flex-col items-center justify-center gap-5">
              <div className="text-xl font-semibold uppercase text-white">
                preparing round
              </div>
              <div className="text-6xl font-extrabold uppercase text-[#f5b95a] delay-100">
                starting in {formatMillisecondsShort(prepareTime)}
              </div>
            </div>
          )}
          {crashStatus === ECrashStatus.END && (
            <div
              className={`absolute flex h-full w-full scale-100 items-center justify-center opacity-100 transition-all duration-300 ease-in-out`}
            >
              <div className="absolute flex h-full w-full items-center justify-center">
                <img src={BoomPNG} width={300} />
              </div>
              <div className="absolute flex h-full w-full items-center justify-center">
                <label className="text-[4rem] font-bold text-[#ff0000]">
                  Crashed
                </label>
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

          <Line className="rounded-lg" data={data} {...(config as object)} />
        </div>
      </div>
      <div className="bg-main-container-background-color relative z-20 mt-[-40px] flex overflow-x-hidden px-[15px] py-[10px]">
        {crashHistory.length > 0 &&
          crashHistory.map((item, _index) => {
            return (
              <label
                style={{ color: item.color }}
                className={`mr-10 font-bold`}
                key={_index}
              >
                {item.value}x
              </label>
            );
          })}
      </div>
    </div>
  );
}
