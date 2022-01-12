import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/pages/Home.module.css";
import { Fragment } from "react";
const Images = [
    {
        width: 704,
        height: 438,
        src: "/SlashCommands.png",
        title: "Slash Commands Support",
        alt: "SlashCommands",
    },
    {
        width: 664,
        height: 257,
        src: "/moderation.png",
        title: "Moderation Commands",
        alt: "moderation",
    },
    {
        width: 718,
        height: 226,
        src: "/webhookEmojis.png",
        title: "Webhook Emojis",
        alt: "webhook",
    },
    {
        width: 720,
        height: 407,
        src: "/welcomer.png",
        title: "Welcome New Users",
        alt: "welcomer",
    },
    {
        width: 712,
        height: 211,
        src: "/music.png",
        title: "Music Commands",
        alt: "music",
    },
];

import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../components/footer/Footer"));

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>PhantomKnight - An Open Source Discord Bot</title>
                <meta
                    property="og:title"
                    content="PhantomKnight - An Open Source Discord Bot"
                />
                <meta
                    name="description"
                    content="An Open Source Discord Bot with moderation, Music,Music Playlist Support, Leveling, Image Manipulation, Webhook Emojis and many more things."
                />
                <meta
                    property="og:description"
                    content="An Open Source Discord Bot with moderation, Music,Music Playlist Support, Leveling, Image Manipulation, Webhook Emojis and many more things."
                />
                <meta property="theme-color" content="#4285f4" />
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
                    alt="repo"
                />
                {Images &&
                    Images.map((img, index) => {
                        return (
                            <Fragment key={index}>
                                <h3 className={styles.h3}>{img.title}</h3>
                                <Image
                                    src={`${img.src}`}
                                    alt={`${img.alt}`}
                                    width={img.width}
                                    height={img.height}
                                />
                            </Fragment>
                        );
                    })}
                <div className={styles.align}>
                    <h3 className={styles.h3}>More Commands</h3>
                    <p style={{ fontSize: `1.18rem` }}>
                        Image Manipulation <br />
                        User playlist creation
                    </p>

                    <br />
                    <h3 className={styles.h3}>And Many More On The Way</h3>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
