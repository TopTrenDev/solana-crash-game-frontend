import { Link } from 'react-router-dom';
import UserNav from '@/components/shared/user-nav';
import { Button } from '@/components/ui/button';
import useModal from '@/hooks/use-modal';
import { ModalType } from '@/types/modal';
import { useAppSelector } from '@/store/redux';
import { tabItems } from '@/constants/data';
import logo from '@/assets/img/logo.svg';

interface HeaderProps {
  isApp: boolean;
}

export default function Header({ isApp }: HeaderProps) {
  const modal = useModal();
  const userData = useAppSelector((store: any) => store.user.userData);

  const handleLogin = async () => {
    modal.open(ModalType.LOGIN);
  };

  const handleRegister = async () => {
    modal.open(ModalType.REGISTER);
  };

  const handleModalOpen = async (modalType: ModalType) => {
    modal.open(modalType);
  };

  return (
    <div className="flex flex-1 items-center justify-between bg-dark bg-opacity-30 px-[80px] py-[28px] bg-blend-multiply">
      <div className="flex">
        <Link
          to="/"
          className="via-green-500 flex bg-gradient-to-r from-[#9E00FF] to-[#14F195] bg-clip-text text-[24px] font-semibold text-transparent"
        >
          <img className="mr-[11px]" src={logo} alt="" />
          <p className="text-white">Bustalot</p>
        </Link>
      </div>
      {isApp && (
        <div className="flex">
          {tabItems.map((item, index) => (
            <div
              key={index}
              className={
                'min-h-full cursor-pointer rounded-none border-b-2 border-b-transparent px-6 py-5 text-[14px] font-medium uppercase text-[#fff] duration-300 hover:bg-transparent hover:text-[#9E00FF]'
              }
              onClick={() => handleModalOpen(item.modal)}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
      <div className="ml-4 mr-8 flex items-center gap-1 md:ml-6">
        {isApp ? (
          userData?.username !== '' ? (
            <div className="flex items-center gap-4">
              <UserNav />
            </div>
          ) : (
            <>
              <Button
                className="rounded-[12px] border-b-2 border-t-2 border-b-[#292447] border-t-[#6f62c0] bg-[#463E7A] px-[24px] py-[16px] hover:bg-[#6f62c0]"
                onClick={handleLogin}
              >
                <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  Login
                </span>
              </Button>
              <Button
                className="rounded-[12px] border-b-2 border-t-2 border-b-[#5c4b21] border-t-[#e7c777] bg-[#EEAF0E] px-[24px] py-[16px] hover:bg-[#caab5c]"
                onClick={handleRegister}
              >
                <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  Register
                </span>
              </Button>
            </>
          )
        ) : (
          <Link
            className="rounded-[12px] border-b-4 border-t-4 border-b-[#6e32b8] border-t-[#be8afd] bg-[#9945FF] px-[24px] py-[16px] text-[16px] text-[#fff] hover:bg-[#a376da]"
            to={'/play'}
          >
            <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              Play
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
