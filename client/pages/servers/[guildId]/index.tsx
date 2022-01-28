import styles from "styles/scss/servers/ManageServer.module.scss";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserState } from "@context/userContext";
import { guild } from "types";
import { toast, ToastContainer } from "react-toastify";
const routes = [
    {
        href: "/automod",
        name: "Moderation",
        desc: "Moderation Settings For Your Server",
    },
    {
        href: "/welcome",
        name: "Welcome",
        desc: "Welcome Message Settings For Your Server",
    },
];
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
            <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
            <div className={styles.container}>
                {routes
                    ? routes.map((route, index) => {
                          return (
                              <div
                                  key={index}
                                  className={styles.contentContainer}
                                  onClick={() => {
                                      router.push(
                                          `${router.asPath}${route.href}`
                                      );
                                  }}
                              >
                                  <div className={styles.glassMorph}>
                                      <h3>{route.name}</h3>
                                      <p> {route.desc} </p>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
}

export default ManageServerOption;
