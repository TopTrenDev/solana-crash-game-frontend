import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import useTempuser from '@/hooks/use-tempuser';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts';

export default function UserInfoModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const { isUser, user } = useAppSelector((state: any) => state.tempuser);
  const [chartOption, setChartOption] = useState<ApexOptions>({
    chart: {
      type: 'area',
      stacked: false,
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    tooltip: {
      enabled: false
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        },
        style: {
          colors: '#ffffff'
        }
      },
      title: {
        text: 'Cumulative Net Profit',
        style: {
          color: '#ffffff'
        }
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    },
  })
  const isOpen = open && type === ModalType.USERINFO;

  const modal = useModal();
  const tempUser = useTempuser();

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.USERINFO);
      tempUser.remove();
    }
  };

  const datas = [
    {
      x: new Date('2022-01-01').getTime(),
      y: 3400000
    },
    {
      x: new Date('2022-01-02').getTime(),
      y: 3200000
    },
    {
      x: new Date('2022-01-03').getTime(),
      y: 3300000
    },
    {
      x: new Date('2022-01-04').getTime(),
      y: 3100000
    },
    {
      x: new Date('2022-01-05').getTime(),
      y: 3000000
    },
    {
      x: new Date('2022-01-06').getTime(),
      y: 3500000
    },
    {
      x: new Date('2022-01-07').getTime(),
      y: 3600000
    },
    {
      x: new Date('2022-01-08').getTime(),
      y: 3700000
    },
    {
      x: new Date('2022-01-09').getTime(),
      y: 3800000
    },
    {
      x: new Date('2022-01-10').getTime(),
      y: 3900000
    }
  ];

  const chartState = {
          
    series: [{
      name: 'XYZ MOTORS',
      data: datas
    }],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom'
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Stock Price Movement',
        align: 'left'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0);
          },
        },
        title: {
          text: 'Price'
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return (val / 1000000).toFixed(0)
          }
        }
      }
    },
  };

  useEffect(() => {
    console.log("is user => ", isUser)
    if (isUser) {
      console.log("userId", user)
    }
  }, [isOpen])

  if(isUser){
    return (
      <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
        <DialogContent className="w-full gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
          <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
            <DialogTitle className="text-center text-[24px] font-semibold uppercase">
              USER STATS
            </DialogTitle>
            <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-7 w-7 text-white" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col items-center rounded-b-[8px] bg-[#2C2852] px-[15px] overflow-y-auto max-h-[90vh]">
            <div className='flex justify-between py-6 w-full border-b-4 border-gray-500'>
              <div className='flex items-center gap-2'>
                <FaUser />
                {user.username}
              </div>
              <div className='flex items-center gap-2'>
                <span className='uppercase'>Joined:</span>
                <span className='text-base font-thin'>Tue Fe 20 2024 <span className='text-sm font-thin'>[ 5 months ago ]</span></span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-6 py-6">
              <div className='pl-[15px] uppercase'>
                Performance
              </div>
              <div className='flex w-full flex-col gap-4 px-[40px]'>
                <div className='flex flex-col gap-2'>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Games Played:
                    </h3>
                    <h3 className="text-[16px] font-semibold">{user.stats.played}</h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Total Wagered:
                    </h3>
                    <h3 className="text-[16px] font-semibold">${user.stats.wager}</h3>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Net Profit:
                    </h3>
                    <h3 className="text-[16px] font-semibold">${user.stats.profit.total}</h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Profit All Time High:
                    </h3>
                    <h3 className="text-[16px] font-semibold">${user.stats.profit.high}</h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Profit All Time Low:
                    </h3>
                    <h3 className="text-[16px] font-semibold">${user.stats.profit.low}</h3>
                  </div>
                </div>
              </div>
            </div>
            <Chart series={chartState.series} options={chartOption} type='area' width={'250%'}/>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
