import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "styles/scss/servers/AutoMod.module.scss";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "@constants/index";
import { useRouter } from "next/router";
import { autoModConfig } from "types";
function AutoMod({ config }: autoModConfig) {
    const router = useRouter();
    const { data } = useQuery(
        "automod",
        async () => {
            const wordsConfig = await axios
                .get(`${backendUrl}words/${router.query.guildId}`)
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    return err.message;
                });
            return wordsConfig;
        },
        {
            initialData: config,
        }
    );
    return (
        <div>
            <Head>
                <title>Manage AutoMod Configuration</title>
            </Head>
            <div>
                <div className={styles.container}>
                    <div className={styles.contentContainer}></div>
                </div>
            </div>
        </div>
    );
}

export default AutoMod;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const config = await axios
        .get(`${backendUrl}words/${context.query.guildId}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err.message;
        });
    return {
        props: {
            config,
        },
    };
};
