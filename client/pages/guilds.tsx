import { useUserState } from "context/userContext";
import { useEffect } from "react";
import { guild } from "types";
import styles from "styles/scss/pages/Guilds.module.scss";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
function Guilds() {
    const { guilds, id } = useUserState();
    const router = useRouter();
    useEffect(() => {
        if (!id) {
            router.push("/");
        }
    }, []);
    return (
        <div>
            <Head>
                <title>Servers</title>
            </Head>
            {guilds && guilds.length ? (
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
            ) : (
                <div className={styles.mainContainer}>
                    <div className={styles.container}>
                        <div className={styles.messageContainer}>
                            {
                                "You don't share any discord server with the bot. Add bot in a Server and try again later."
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Guilds;
