import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar/Navbar";
import { UserStateProvider } from "../context";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <UserStateProvider>
                    <Navbar />
                    <Component {...pageProps} />
                    <ReactQueryDevtools />
                </UserStateProvider>
            </QueryClientProvider>
        </>
    );
}
export default MyApp;
