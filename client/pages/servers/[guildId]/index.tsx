import styles from "styles/scss/servers/ManageServer.module.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserState } from "@context/userContext";
import { guild } from "types";
function ManageServerOption() {
    const router = useRouter();
    const { guilds } = useUserState();
    const [currentGuild, setCurrentGuild] = useState<guild>({} as guild);
    useEffect(() => {
        if (!guilds) {
            router.push("/servers");
        }
        guilds?.forEach((eachguild: guild) => {
            if (eachguild.id == router.query.guildId) {
                setCurrentGuild(eachguild);
            }
        });
    }, [router.isReady]);
    return (
        <div>
            <Head>
                <title>
                    {currentGuild
                        ? `Configure ${currentGuild.name}'s Settings`
                        : "Configure Server's Settings"}
                </title>
            </Head>
            <div className={styles.container}>
                <div
                    className={styles.contentContainer}
                    onClick={() => {
                        router.push(`${router.asPath}/automod`);
                    }}
                >
                    <div className={styles.glassMorph}>
                        <h3>Moderation</h3>
                        <p>Moderation Settings For Your Server</p>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.glassMorph}>
                        <h3>Welcome</h3>
                        <p>Manage Welcome Config For Your Server</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageServerOption;
