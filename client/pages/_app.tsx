import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar/Navbar';
import { UserStateProvider } from '../context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
const Footer = dynamic(() => import('../components/footer/Footer'));
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
    <QueryClientProvider client={queryClient}>
        <UserStateProvider>
                <Navbar />
                <Component {...pageProps} />
                <Footer />
                <ReactQueryDevtools />
        </UserStateProvider>
    </QueryClientProvider>
        </>
    );
}
export default MyApp;
