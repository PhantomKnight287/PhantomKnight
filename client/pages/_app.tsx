import "../styles/globals.scss";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar/Navbar";
import { UserStateProvider } from "../context";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import 'emoji-mart/css/emoji-mart.css';
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
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
