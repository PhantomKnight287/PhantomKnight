import Head from "next/head";
import { useUserState } from "context/index";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import styles from "styles/scss/pages/Add.module.scss";
import axios from "axios";
import { backendUrl } from "@constants/index";
import { Songs } from "../../../../types";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
function AddSong() {
    const { username, id } = useUserState();
    const [song, setSong] = useState("");
    const [songs, setSongs] = useState<Songs>([]);
    const color = Math.floor(Math.random() * 16777215).toString(16);
    const [loading, setLoading] = useState(false);
    const { query } = useRouter();
    const searchSong = async () => {
        setLoading(true);
        axios
            .post(`${backendUrl}search`, { song })
            .then((res) => {
                setLoading(false);
                setSongs(res.data.songs);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };
    const addSong = async (title: string, thumbnail: string) => {
        if (!id) {
            return toast.error("You Can Only Manage Playlist After Login.");
        }
        if (id != query.userId) {
            return toast.error("This Playlist Doesn't Belongs to You!");
        }
        axios
            .post(`${backendUrl}add/${query.userId}`, {
                song: {
                    title,
                    thumbnail,
                },
            })
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(() => {
                toast.error("An Error Occured");
            });
    };
    return (
        <div>
            <Head>
                <title>
                    {username
                        ? `Add New Songs To Playlist | ${username}`
                        : "Add New Songs To Playlist"}
                </title>
                <meta
                    property="og:title"
                    content={
                        username
                            ? `Add New Songs To Playlist | ${username}`
                            : "Add New Songs To Playlist"
                    }
                />
                <meta
                    property="og:description"
                    content={
                        username
                            ? `Add New Songs to ${username}'s Playlist`
                            : "Add New Song to Playlist"
                    }
                />
                <meta
                    property="description"
                    content={
                        username
                            ? `Add New Songs to ${username}'s Playlist`
                            : "Add New Song to Playlist"
                    }
                />
                <meta property="theme-color" content={`#${color}`} />
            </Head>
            <ToastContainer
                hideProgressBar
                pauseOnFocusLoss={false}
                pauseOnHover={false}
            />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h3>Search For Songs</h3>
                    <TextField
                        variant="filled"
                        value={song}
                        onChange={(e) => {
                            setSong(e.target.value);
                        }}
                        color="info"
                        label="Song Name"
                        placeholder="Enter Song Name"
                        focused
                    />
                    <div className={styles.buttonContainer}>
                        <Button variant="outlined" onClick={searchSong}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className={styles.songsContainer}>
                    {songs ? (
                        songs.map((updatedSong, index) => {
                            return (
                                <div
                                    key={index}
                                    className={styles.songContainer}
                                >
                                    <Image
                                        src={`https://i3.ytimg.com/vi/${updatedSong.id}/hqdefault.jpg`}
                                        alt="thumbnail"
                                        width={480}
                                        height={360}
                                        loading="lazy"
                                    />
                                    <h4>{updatedSong.original_title}</h4>
                                    <div className={styles.buttonContainer}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                addSong(
                                                    updatedSong.original_title,
                                                    `https://i3.ytimg.com/vi/${updatedSong.id}/hqdefault.jpg`
                                                );
                                            }}
                                        >
                                            Add To Playlist
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <>{loading ? <CircularProgress /> : null}</>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddSong;
