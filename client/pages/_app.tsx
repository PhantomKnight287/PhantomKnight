import "../styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar/Navbar";
import { UserStateProvider } from "../context";

const Footer = dynamic(() => import("../components/footer/Footer"), {
    loading: () => <p>loading....</p>
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <UserStateProvider>
                <Navbar />
                <Component {...pageProps} />
                <Footer />
            </UserStateProvider>
        </>
    );
}
export default MyApp;
