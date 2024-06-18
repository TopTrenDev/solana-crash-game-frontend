import { Button } from '@/components/ui/button';
import { useRouter } from '@/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from './chat-provider';

export const queryClient = new QueryClient();

const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter();
  return (
    <div
      className="text-red-500 flex h-screen w-screen flex-col  items-center justify-center"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">Ooops, something went wrong</h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

export default function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
              <ChatProvider>
                {/* <ReactQueryDevtools /> */}
                {children}
              </ChatProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}
