import { useUserState } from "context/userContext";
import { useEffect } from "react";
import { guild } from "types";
import styles from "styles/scss/pages/Guilds.module.scss";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
function Guilds() {
    const { guilds } = useUserState();
    const router = useRouter();
    useEffect(() => {
        if (!guilds?.length) {
            router.push("/");
        }
        console.clear();
        if (guilds) {
            console.groupCollapsed("Guilds");
        }
    }, []);
    return (
        <div>
            <Head>
                <title>Servers</title>
            </Head>
            {guilds ? (
                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <div className={styles.headingContainer}>
                            <h1>Servers</h1>
                        </div>
                        <div className={styles.allGuildsContainer}>
                            {guilds.map((resGuild: guild) => {
                                return (
                                    <div
                                        key={resGuild.id}
                                        className={styles.guildContainer}
                                    >
                                        <Image
                                            src={
                                                resGuild.icon
                                                    ? `https://cdn.discordapp.com/icons/${resGuild.id}/${resGuild.icon}.png?size=256`
                                                    : "/background.jpeg"
                                            }
                                            className={
                                                resGuild.invited
                                                    ? styles.allowedImage
                                                    : styles.img
                                            }
                                            width={142}
                                            height={140}
                                        />
                                        {resGuild.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Guilds;
