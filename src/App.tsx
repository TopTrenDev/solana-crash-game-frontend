import AppRouter from './routes';
import { AppProvider, SolanaWalletProvider } from './provider';
import Modal from './components/shared/modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from '@/store/redux';

export default function App() {
  return (
    <AppProvider>
      <Provider store={store}>
        <SolanaWalletProvider>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop={false}
            limit={1}
            rtl={false}
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="light"
          />
          <Modal />
          <AppRouter />
        </SolanaWalletProvider>
      </Provider>
    </AppProvider>
  );
}
