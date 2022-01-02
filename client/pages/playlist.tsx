import { useEffect, useState } from "react";
import { useUserState } from "@context/index";
import { useRouter } from "next/router";
import styles from "@styles/scss/pages/Playlist.module.scss";
import { Button } from "@mui/material";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "@constants/index";
function Playlist() {
    const [songs, setSongs] =
        useState<{ title: string; thumbnail: string }[]>();
    const [message, setMessage] = useState<string>("");
    const user = useUserState();
    const router = useRouter();
    function handleSongRemove(sus: { title: string; thumbnail: string }) {
        axios
            .post(`${backendUrl}/playlist/${user.id}`, {
                song: sus,
            })
            .then((res) => {
                setSongs(res.data.songs);
            })
            .catch((_) => {
                toast.error("An Error Occured, Please Try Again Later");
            });
    }
    useEffect(() => {
        if (!user.id) {
            router.push("/");
        }
        axios
            .get(`${backendUrl}/playlist/${user.id}`)
            .then((res) => {
                if (res.data.message) {
                    setMessage(res.data.message);
                } else {
                    setSongs(res.data.songs);
                }
            })
            .catch((err) => {
                toast.error(err.message);
            });
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
                    {message
                        ? message
                        : `It looks like You don't have any playlist created, Go
                    to discord to create one. If You Have A Playlist and still
                    see this message, Create an issue on`}
                    <a href="https://github.com/PhantomKnight287/Phantomknight">
                        github
                    </a>
                </div>
            )}
        </div>
    );
}

export default Playlist;
