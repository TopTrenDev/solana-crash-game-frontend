import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useDispatch } from 'react-redux';
import { userActions } from '@/store/redux/actions';

export default function UserInfoModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const userData = useAppSelector((state: any) => state.user);
  const user = userData.selectedUser;
  const [chartOption, setChartOption] = useState<ApexOptions>({
    chart: {
      type: 'area',
      stacked: false,
      toolbar: {
        show: false,
        tools: {
          zoom: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      enabled: false
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toString();
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
      }
    },
    xaxis: {
      labels: {
        style: {
          colors: '#ffffff'
        }
      }
    }
  });
  const isOpen = open && type === ModalType.USERINFO;
  const dispatch = useDispatch();
  const modal = useModal();

  const handleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.USERINFO);
      dispatch(userActions.removeSelectedUser());
    }
  };

  const datas =
    (user?.histories &&
      user.histories.map((h, i) => ({ x: i + 1, y: h.netProfit }))) ||
    [];

  useEffect(() => {
    // console.log('is user => ', isUser);
    // if (isUser) {
    //   console.log('userId', user);
    // }
  }, [isOpen]);

  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
          <div className="flex max-h-[90vh] flex-col items-center overflow-y-auto rounded-b-[8px] bg-[#2C2852] px-[15px]">
            <div className="flex w-full justify-between border-b-4 border-gray-500 py-6">
              <div className="flex items-center gap-2">
                <FaUser />
                {user.username}
              </div>
              <div className="flex items-center gap-2">
                <span className="uppercase">Joined:</span>
                <span className="text-base font-thin">
                  {new Date(user.createdAt).toDateString()}
                  {/* <span className="text-sm font-thin">[ 5 months ago ]</span> */}
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-6 py-6">
              <div className="pl-[15px] uppercase">Performance</div>
              <div className="flex w-full flex-col gap-4 px-[40px]">
                <div className="flex flex-col gap-2">
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Games Played:
                    </h3>
                    <h3 className="text-[16px] font-semibold">{user.played}</h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Total Wagered:
                    </h3>
                    <h3 className="text-[16px] font-semibold">${user.wager}</h3>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Net Profit:
                    </h3>
                    <h3 className="text-[16px] font-semibold">
                      ${(user?.profit?.total || 0).toFixed(2)}
                    </h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Profit All Time High:
                    </h3>
                    <h3 className="text-[16px] font-semibold">
                      ${user?.profit?.high || 0}
                    </h3>
                  </div>
                  <div className="flex w-full flex-col justify-between lg:flex-row">
                    <h3 className="w-full text-[16px] font-normal text-gray-500 lg:w-1/3">
                      Profit All Time Low:
                    </h3>
                    <h3 className="text-[16px] font-semibold">
                      ${user?.profit?.low || 0}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <Chart
              series={[
                {
                  name: 'XYZ MOTORS',
                  data: datas
                }
              ]}
              options={chartOption}
              type="area"
              width={'250%'}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
