import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@styles/scss/pages/Playlist.module.scss";
import { Button } from "@mui/material";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "@constants/index";
import Image from "next/image";
import { userData as userDataType } from "../../../types";
import { GetServerSideProps } from "next";
import {useUserState} from "@context/index";
function Playlist({
    user,
}: {
    user: {
        songs: { title: string; thumbnail: string }[];
        message: null | string;
        user: userDataType;
    };
}) {
    const {id} = useUserState();
    const [songs, setSongs] =
        useState<{ title: string; thumbnail: string }[]>();
    const router = useRouter();
    function handleSongRemove(sus: { title: string; thumbnail: string }) {
        if (!id) {
            return toast.error("You need to Login to Manage the playlist!");
        }
        if ((user.user as any).id != router.query.userId) {
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
        setSongs(user.songs);
    }, [router.query.userId]);
    return (
        <>
            <Head>
                <title>
                    {user.user && user.user.username
                        ? `Playlist | ${user.user.username}`
                        : "Playlist"}
                </title>
                <meta
                    property="og:title"
                    content={
                        user.user && user.user.username
                            ? `Playlist | ${user.user.username}`
                            : "Playlist"
                    }
                />
                <meta
                    property="og:description"
                    content={
                        user.user && user.user.username
                            ? `Manage Playlist of ${user.user.username}`
                            : "Manage Playlist"
                    }
                />
                <meta
                    property="description"
                    content={
                        user.user && user.user.username
                            ? `Manage Playlist of ${user.user.username}`
                            : "Manage Playlist"
                    }
                />
            </Head>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />

            {user.user && user.user.username && (
                <div className={styles.userInfoContainer}>
                    <Image
                        src={(user.user as any).displayAvatarURL}
                        width={128}
                        height={128}
                    />
                    <div>
                        <h3>{user.user.username}</h3>
                        <span>#{user.user.discriminator}</span>
                    </div>
                </div>
            )}

            <div className={styles.mainContentContainer}>
                {songs && songs.length > 0 ? (
                    songs.map(
                        (song: { thumbnail: string; title: string }, index) => {
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
                        }
                    )
                ) : (
                    <div className={styles.contentContainer}>
                        {`It looks like You don't have any playlist created, Go
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
export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = await axios
        .get(`${backendUrl}playlist/${context.query.userId}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return err.message;
        });

    return {
        props: {
            user,
        },
    };
};
export default Playlist;
