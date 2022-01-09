import { useUserState } from "context/userContext";
import { useEffect } from "react";
import { guild } from "types";
import styles from "styles/scss/pages/Guilds.module.scss";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { backendUrl } from "@constants/index";
import { toast, ToastContainer } from "react-toastify";
function Guilds() {
    const { guilds, id } = useUserState();
    const router = useRouter();
    const handleClick = async (guildId: string) => {
        // axios
        //     .post(`${backendUrl}permission/${guildId}`, { userId: id })
        //     .then((res) => {
        //         if (res.data.showMessage) {
        //             toast.success(res.data.message);
        //         }
        //         router.push(`${res.data.redirect}`);
        //         // console.log(res.data);
        //     })
        //     .catch((error) => {
        //         console.log(error.response.data);
        //         if (error.response.data.showMessage) {
        //             toast.error(error.response.data.message);
        //         }
        //         router.push(`${error.response.data.redirect}`);
        //     });
    };
    useEffect(() => {
        if (!id) {
            router.push("/");
        }
    }, []);
    return (
        <div>
            <Head>
                <title>Servers</title>
                <meta property="theme-color" content="#4285f4" />
                <meta property="og:title" content="Servers | PhantomKnight" />
                <meta
                    property="og:description"
                    content="Manage Server Configuration for PhantomKnight."
                />
                <meta
                    property="description"
                    content="Manage Server Configuration for PhantomKnight."
                />
            </Head>
            <ToastContainer
                hideProgressBar
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable
            />
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
                                        onClick={(e) =>
                                            handleClick(resGuild.id)
                                        }
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
