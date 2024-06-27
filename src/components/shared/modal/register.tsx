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
import useToast from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { axiosPost } from '@/utils/axios';
import { BACKEND_API_ENDPOINT } from '@/utils/constant';
import { useAppSelector } from '@/store/redux';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

const RegisterSchema = z
  .object({
    username: z.string().nonempty('Full Name is required'),
    email: z
      .string()
      .nonempty('Email is required')
      .email('Email must be a valid email address'),
    password: z
      .string()
      .nonempty('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().nonempty('Confirm Password is required')
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
        path: ['confirmPassword']
      });
    }
  });

const RegisterDefaultValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export default function RegisterModal() {
  const { open, type } = useAppSelector((state: any) => state.modal);
  const isOpen = open && type === ModalType.REGISTER;
  const modal = useModal();
  const toast = useToast();
  const [agree, setAgree] = useState<boolean>(false);

  const registerForm = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: RegisterDefaultValue
  });

  const handleAgree = () => {
    setAgree((prev) => !prev);
  };

  const hanndleOpenChange = async () => {
    if (isOpen) {
      modal.close(ModalType.REGISTER);
    }
  };

  const handleSignIn = async () => {
    modal.open(ModalType.LOGIN);
  };

  const handleSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      const signUpPayload = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      };
      await axiosPost([
        BACKEND_API_ENDPOINT.auth.register,
        { data: signUpPayload }
      ]);
      modal.close(ModalType.REGISTER);
      modal.open(ModalType.LOGIN);
      toast.success('Register Success');
    } catch (error: any) {
      console.log(error);
      if (error.statusCode === 400) {
        toast.error(error.message);
      } else {
        toast.error('Register Failed');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={hanndleOpenChange}>
      <DialogContent className="w-[800px] !max-w-[800px] gap-0 rounded-[8px] border-2 border-none bg-[#0D0B32] p-0 text-white sm:max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between rounded-t-[8px] bg-[#463E7A] px-[24px] py-[20px]">
          <DialogTitle className="text-center text-[24px] font-semibold uppercase">
            Register
          </DialogTitle>
          <DialogClose className="hover:ropacity-100 !my-0 rounded-sm opacity-70 outline-none ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:text-muted-foreground">
            <Cross2Icon className="h-7 w-7 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(handleSubmit)}>
            <div className="flex flex-col items-center gap-7 rounded-b-lg bg-[#2C2852] px-[128px] py-[36px]">
              <div className="flex w-full flex-col gap-3">
                <div className="grid w-full flex-1 gap-1">
                  <p className="text-sm text-[#9688CC]">Username</p>
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="username"
                            className="border border-none bg-[#463E7A] text-white placeholder:text-[#9083e6]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid w-full flex-1 gap-1">
                  <p className="text-sm text-[#9688CC]">Email</p>
                  <FormField
                    control={registerForm.control}
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
                <div className="grid w-full flex-1 gap-1">
                  <p className="text-sm text-[#9688CC]">Password</p>
                  <FormField
                    control={registerForm.control}
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
                <div className="grid w-full flex-1 gap-1">
                  <p className="text-sm text-[#9688CC]">Confirm Password</p>
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
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
                  <Checkbox
                    id="terms"
                    className="text-[#9688CC]"
                    checked={agree}
                    onCheckedChange={handleAgree}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm italic leading-none text-[#9688CC] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Agree with our Terms & Conditions
                  </label>
                </div>
              </div>
              <Button
                className="h-12 w-full rounded-[12px] border-b-4 border-t-4 border-b-[#682fad] border-t-[#ba88f8] bg-[#9945FF] px-3 py-3 hover:bg-[#ad77f0]"
                type="submit"
                disabled={!agree}
              >
                Register
              </Button>
              <p className="flex text-sm text-[#fff]">
                Already a member? Login&nbsp;
                <span
                  className="cursor-pointer font-semibold text-[#9688CC]"
                  onClick={handleSignIn}
                >
                  here
                </span>
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
