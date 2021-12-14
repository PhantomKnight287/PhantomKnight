import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/pages/Home.module.css";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>PhantomKnight - An Open Source Discord Bot</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Why PhantomKnight?</h1>
                <h3>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/PhantomKnight287/PhantomKnight"
                        className={styles.h3}
                    >
                        Open Source
                    </a>
                </h3>
                <Image
                    src="/repo.png"
                    width={1262}
                    height={674}
                    loading="lazy"
                />
                <h3 className={styles.h3}>Slash Commands Support</h3>
                <Image
                    src="/SlashCommands.png"
                    width={704}
                    height={428}
                    loading="lazy"
                />
                <h3 className={styles.h3}>Moderation Commands</h3>
                <Image
                    src="/moderation.png"
                    width={664}
                    height={257}
                    loading="lazy"
                />
                <h3 className={styles.h3}>Webhook Emojis</h3>
                <Image
                    src="/webhookEmojis.png"
                    width={718}
                    height={226}
                    loading="lazy"
                />
                <h3 className={styles.h3}>Welcome New Users</h3>
                <Image
                    src="/welcomer.png"
                    width={720}
                    height={407}
                    loading="lazy"
                />
                <h3 className={styles.h3}>Music Commands</h3>
                <Image
                    src="/music.png"
                    width={712}
                    height={211}
                    loading="lazy"
                />
                <div className={styles.align}>
                    <h3
                        className={styles.h3}
                    >
                        More Commands
                    </h3>
                    <p style={{fontSize: `1.18rem`}}>
                        Image Manipulation <br />
                        User playlist creation
                    </p>

                    <br />
                    <h3 className={styles.h3}>And Many More On The Way</h3>
                </div>
            </main>
        </div>
    );
};

export default Home;
