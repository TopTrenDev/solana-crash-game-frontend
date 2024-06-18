import { toast } from 'react-toastify';

const SuccessToast = ({ content }: { content: string }) => {
  return (
    <div className="flex-row gap-2">
      <div
        className="d-flex align-items-center whitespace-nowrap text-nowrap px-2 text-sm text-white"
        style={{ fontSize: '.9rem' }}
      >
        {content}
      </div>
    </div>
  );
};

const ErrorToast = ({ content }: { content: string }) => (
  <div className="flex-row gap-2">
    <div
      className="d-flex align-items-center whitespace-nowrap text-nowrap px-2 text-sm text-white"
      style={{ fontSize: '.9rem' }}
    >
      {content}
    </div>
  </div>
);

const useToast = () => {
  const success = (content: string) =>
    toast.success(<SuccessToast content={content} />);
  const error = (content: string) =>
    toast.error(<ErrorToast content={content} />);
  return {
    success,
    error
  };
};

export default useToast;
