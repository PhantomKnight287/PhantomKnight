import { backendUrl } from "../constants";
import axios from "axios";
import { useState, useEffect } from "react";
import Head from "next/head";
import { BotStats } from "types";
import styles from "styles/scss/pages/Stats.module.scss";
import { SiMaterialui } from "react-icons/si";
import { GiNetworkBars } from "react-icons/gi";
import { IoMdTime } from "react-icons/io";
import prettyms from "pretty-ms";
export default function StatsPage() {
    const [stats, setStats] = useState<BotStats>({} as BotStats);
    const [color, setColor] = useState("green");
    useEffect(() => {
        axios
            .get(`${backendUrl}stats`)
            .then((res) => {
                setStats(res.data.stats);
                if (res.data.stats.Ping > 300 && res.data.stats.Ping < 450) {
                    setColor("yellow");
                }
                if (res.data.stats.Ping > 450) {
                    setColor("red");
                }
                if (res.data.stats.Ping < 300) {
                    setColor("green");
                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Current Stats of PhantomKnight </title>
                <meta
                    property="og:title"
                    content="Current Stats of PhantomKnight"
                />
                <meta
                    property="og:description"
                    content="Get Current Stats of PhantomKnight Including Member Count,Server Count,Latency and Tech Stack Used!"
                />
                <meta
                    name="description"
                    content="Get Current Stats of PhantomKnight Including Member Count,Server Count,Latency and Tech Stack Used!"
                />
                <meta
                    property="theme-color"
                    content={`#${Math.floor(Math.random() * 16777215).toString(
                        16
                    )}`}
                    // generates a random color every time.
                />
            </Head>
            <div className={styles.contentContainer}>
                <h2>Bot Stats</h2>
                {!stats.Members ? (
                    <h2>Loading Data</h2>
                ) : (
                    <div className={styles.container}>
                        <div>
                            <img src="/Server.webp" alt="Server Logo" />
                            Servers - {"\n"}
                            {stats.Servers}
                        </div>
                        <div>
                            <img src="/members.webp" alt="Members Logo" />
                            Members - {"\n"}
                            {stats.Members}
                        </div>
                        <div>
                            <GiNetworkBars size={50} color={color} /> Ping -{" "}
                            {"\n"}
                            {stats.Ping} ms
                        </div>
                        <div>
                            <IoMdTime size={50} color={"grey"} /> Uptime -{" "}
                            {"\n"} {prettyms(stats.Uptime)}
                        </div>
                        <div>
                            <img
                                src="/Typescript.webp"
                                height="63px"
                                alt="TSLOGO"
                            />
                            Typescript Version - {"\n"}
                            {stats.Typescript}
                        </div>
                        <div>
                            <img src="/DJS.webp" height="63px" alt="DJS Logo" />
                            Discord.js Version - {"\n"}
                            {stats.DJS}
                        </div>
                    </div>
                )}
                <h2>Tech Stack Used</h2>
                <div className={styles.container}>
                    <div>
                        <img
                            src="/nextjs.webp"
                            alt="nextjs Logo"
                            height="63px"
                        />
                        Next.js
                    </div>
                    <div>
                        <img
                            src="/Typescript.webp"
                            height="63px"
                            alt="TSLOGO"
                        />
                        Typescript
                    </div>
                    <div>
                        <img src="/Scss.webp" height="63px" alt="TSLOGO" />
                        Scss
                    </div>
                    <div>
                        <SiMaterialui size={50} color="skyblue" /> Material UI
                    </div>
                </div>
            </div>
        </>
    );
}
