import AppProvider from './provider';
import AppRouter from './routes';
import Modal from './components/shared/modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from '@/store/redux';
import { WalletContext } from './provider/crypto/wallet';
import { NetworkContext } from './provider/crypto/network';
import { PasskeyContext } from './provider/crypto/passkey';

export default function App() {
  return (
    <AppProvider>
      <Provider store={store}>
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
        <PasskeyContext>
          <NetworkContext>
            <WalletContext>
              <Modal />
              <AppRouter />
            </WalletContext>
          </NetworkContext>
        </PasskeyContext>
      </Provider>
    </AppProvider>
  );
}
