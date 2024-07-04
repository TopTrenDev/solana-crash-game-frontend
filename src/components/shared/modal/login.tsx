import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ModalType } from '@/types/modal';
import useModal from '@/hooks/use-modal';
import { z } from 'zod';
import useToast from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosPost, setAccessToken } from '@/utils/axios';
import { BACKEND_API_ENDPOINT } from '@/utils/constant';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { useDispatch } from 'react-redux';
import { userActions } from '@/store/redux/actions';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';

const LoginSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .email('Email must be a valid email address'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

const LoginDefaultValue = {
  email: '',
  password: ''
};

export default function LoginModal() {
  const toast = useToast();
  const modal = useModal();
  const modalState = useAppSelector((state: any) => state.modal);
  const dispatch = useDispatch();
  const isOpen = modalState.open && modalState.type === ModalType.LOGIN;
  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: LoginDefaultValue
  });

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.LOGIN);
    }
  };

  const handleSignUp = async () => {
    modal.open(ModalType.REGISTER);
  };

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const signInPayload = {
        email: data.email,
        password: data.password
      };
      const resSignIn = await axiosPost([
        BACKEND_API_ENDPOINT.auth.login,
        { data: signInPayload }
      ]);
      if (resSignIn.responseObject.auth.accessToken) {
        setAccessToken(resSignIn.responseObject.auth.accessToken);
        dispatch(
          userActions.userData({
            ...resSignIn.responseObject.user,
            wallet: resSignIn.responseObject.user.wallet.publicKey
          })
        );
        toast.success('SignIn Success');
        modal.close(ModalType.LOGIN);
        return;
      }
    } catch (error: any) {
      if (error.statusCode === 400) {
        toast.error(error.message);
      } else {
        toast.error('Login Failed');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="!max-w-[300px] gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm lg:w-[800px] lg:!max-w-[800px]">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Log In
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleSubmit)}>
            <div className="flex flex-col items-center gap-7 rounded-b-lg bg-[#2C2852] px-[15px] py-[36px] lg:px-[128px]">
              <div className="flex w-full flex-col gap-5">
                <div className="grid w-full flex-1 gap-3">
                  <p className="text-[#9688CC]">Email</p>
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="email"
                            className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-3">
                  <p className="text-gray-300">Password</p>
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*****"
                            className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="text-[#9945FF]" />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <a href="" className="text-sm font-semibold text-[#9945FF]">
                  Forgot password?
                </a>
              </div>
              <Button
                className="h-12 w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] px-3 py-3 hover:bg-[#ad77f0]"
                type="submit"
              >
                login
              </Button>
              <p className="flex text-sm text-gray-300">
                <span
                  className="cursor-pointer font-semibold text-[#9945FF]"
                  onClick={handleSignUp}
                >
                  Register
                </span>
                &nbsp;a new account
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
