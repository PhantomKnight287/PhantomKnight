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
            guilds.forEach((guild: guild) => {
                console.log(guild);
            });
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
                            <span>
                                You're In{" "}
                                {guilds.length > 1
                                    ? `${guilds.length} servers`
                                    : `${guilds.length} server`}
                            </span>
                        </div>
                        <div className={styles.allGuildsContainer}>
                            {guilds.map((guild: guild) => {
                                return (
                                    <div
                                        key={guild.id}
                                        className={styles.guildContainer}
                                    >
                                        <Image
                                            src={
                                                guild.icon
                                                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
                                                    : "/background.jpeg"
                                            }
                                            className={
                                                guild.invited
                                                    ? styles.allowedImage
                                                    : styles.img
                                            }
                                            width={142}
                                            height={140}
                                        />
                                        {guild.name}
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
