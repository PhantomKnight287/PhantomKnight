import { useEffect, useState } from "react";
import { useUserState } from "@context/index";
import { useSocket } from "@hooks/index";
import { useRouter } from "next/router";
import styles from "@styles/scss/pages/Playlist.module.scss";
import { Button } from "@mui/material";
import Head from "next/head";
function Playlist() {
    const [songs, setSongs] =
        useState<{ title: string; thumbnail: string }[]>();
    const user = useUserState();
    const socket = useSocket();
    const router = useRouter();
    useEffect(() => {
        if (!user.id) {
            router.push("/");
        } else {
            socket.emit("getPlaylists", { id: user.id });
            socket.on("playlists", (args) => {
                if (!args.message) {
                    setSongs(args.songs);
                    console.log(songs);
                }
            });
        }
    }, []);
    return (
        <div className={styles.mainContentContainer}>
            <Head>
                <title>Playlist - {user.username}</title>
            </Head>
            {songs
                ? songs.map((song, index) => {
                      return (
                          <div key={index} className={styles.contentContainer}>
                              <img
                                  src={`${song.thumbnail.replace(
                                      "maxresdefault",
                                      "hqdefault"
                                  )}`}
                              />
                              <div>{song.title}</div>
                              <div className={styles.buttonContainer}>
                                  <Button variant="contained">Remove</Button>
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
}

export default Playlist;
