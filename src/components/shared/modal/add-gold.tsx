import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { useAppSelector } from '@/store/redux';

const AddGoldModal = () => {
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const isOpen = modalState.open && modalState.type === ModalType.ADDGOLD;

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.ADDGOLD);
    }
  };

  return (
    <Dialog open={false} onOpenChange={hanndleOpenChange}>
      <DialogContent className="rounded-lg border-2 border-gray-900 bg-[#0D0B32] p-10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-white">
            Add Gold
          </DialogTitle>
        </DialogHeader>
        <div className="h-60"></div>
        <Button
          className="w-full bg-[#F205B3] py-5 hover:bg-[#F205B3]"
          type="submit"
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoldModal;
