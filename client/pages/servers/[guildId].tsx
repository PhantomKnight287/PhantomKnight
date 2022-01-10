import styles from "styles/scss/servers/ManageServer.module.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
function ManageServerOption() {
    const router = useRouter();
    useEffect(() => {
        // console.log(router);
    }, []);
    return (
        <div>
            <Head>
                <title>Sus</title>
            </Head>
        </div>
    );
}

export default ManageServerOption;
