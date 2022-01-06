import { useEffect, useState } from "react";
import { useUserState } from "@context/index";
import { useRouter } from "next/router";
import styles from "@styles/scss/pages/Playlist.module.scss";
import { Button } from "@mui/material";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "@constants/index";
import Image from "next/image";
import { userData as userDataType } from "../../../types";
function Playlist() {
    const [songs, setSongs] =
        useState<{ title: string; thumbnail: string }[]>();
    const [message, setMessage] = useState<string>("");
    const [queriedUser, setQueriedUser] = useState("");
    const [userData, setUserData] = useState<userDataType>({
        avatar: "",
        discriminator: "",
        username: "",
    });
    const user = useUserState();
    const router = useRouter();
    function handleSongRemove(sus: { title: string; thumbnail: string }) {
        if (!user.id) {
            return toast.error("You need to Login to Manage the playlist!");
        }
        if (user.id != router.query.userId) {
            return toast.error("You Can't Manage this Playlist!");
        }
        axios
            .post(`${backendUrl}playlist/${router.query.userId}`, {
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
        if (router.query.userId && router.isReady) {
            axios
                .get(`${backendUrl}playlist/${router.query.userId}`)
                .then((res) => {
                    if (res.data.message) {
                        setMessage(res.data.message);
                    } else {
                        setSongs(res.data.songs);
                    }
                    if (res.data.user) {
                        setUserData({
                            avatar: res.data.user.displayAvatarURL,
                            discriminator: res.data.user.discriminator,
                            username: res.data.user.username,
                        });
                        setQueriedUser(res.data.user.tag);
                    }
                })
                .catch((err) => {
                    toast.error(err.message);
                });
        }
    }, [router.query.userId]);
    return (
        <>
            <Head>
                <title>Playlist - {queriedUser}</title>
            </Head>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />

            {userData.username && (
                <div className={styles.userInfoContainer}>
                    <Image src={userData.avatar} width={128} height={128} />
                    <div>
                        <h3>{userData.username}</h3>
                        <span>#{userData.discriminator}</span>
                    </div>
                </div>
            )}

            <div className={styles.mainContentContainer}>
                {songs && songs.length > 0 ? (
                    songs.map((song, index) => {
                        return (
                            <div
                                key={index}
                                className={styles.contentContainer}
                            >
                                <Image
                                    src={`${song.thumbnail.replace(
                                        "maxresdefault",
                                        "hqdefault"
                                    )}`}
                                    alt="thumbnail"
                                    width={480}
                                    height={360}
                                    loading="lazy"
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
        </>
    );
}

export default Playlist;
