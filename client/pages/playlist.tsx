import { useEffect, useState } from "react";
import { useUserState } from "@context/index";
import { useSocket } from "@hooks/index";
import { useRouter } from "next/router";
import styles from "@styles/scss/pages/Playlist.module.scss";
import { Button } from "@mui/material";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
function Playlist() {
    const [songs, setSongs] =
        useState<{ title: string; thumbnail: string }[]>();
    const user = useUserState();
    const socket = useSocket();
    const router = useRouter();
    function handleSongRemove(sus: { title: string; thumbnail: string }) {
        socket.emit("deleteSong", { id: user.id, song: sus });
    }
    useEffect(() => {
        if (!user.id) {
            router.push("/");
        } else {
            socket.emit("getPlaylists", { id: user.id });
            socket.on("playlists", (args) => {
                if (args.message) {
                    toast.dark(args.message);
                }
                setSongs(args.songs);
            });
        }
    }, []);
    return (
        <div className={styles.mainContentContainer}>
            <Head>
                <title>Playlist - {user.username}</title>
            </Head>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
            {songs && songs.length > 0 ? (
                songs.map((song, index) => {
                    return (
                        <div key={index} className={styles.contentContainer}>
                            <img
                                src={`${song.thumbnail.replace(
                                    "maxresdefault",
                                    "hqdefault"
                                )}`}
                                alt="thumbnail"
                            />
                            <div>{song.title}</div>
                            <div className={styles.buttonContainer}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        handleSongRemove(song);
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className={styles.contentContainer}>
                    It looks like You don&apos;t have any playlist created, Go
                    to discord to create one. If You Have A Playlist and still
                    see this message, Create an issue on{" "}
                    <a href="https://github.com/PhantomKnight287/Phantomknight">
                        github
                    </a>
                </div>
            )}
        </div>
    );
}

export default Playlist;
