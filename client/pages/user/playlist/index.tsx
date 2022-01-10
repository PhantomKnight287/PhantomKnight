import { useState } from "react";
import { TextField, Button } from "@mui/material";
import styles from "@styles/scss/user/PlaylistIndex.module.scss";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import { useUserState } from "@context/index";
function PlaylistIndex() {
    const [userId, setUserId] = useState<string | undefined>();
    const router = useRouter();
    const { id } = useUserState();
    const handleClick = () => {
        if (`${userId}`.length != 18) {
            toast.error("UserId must be 18 characters long");
        } else {
            router.push(`/user/playlist/${userId}`);
        }
    };
    return (
        <div className={styles.container}>
            <Head>
                <title>Search for Playlist</title>
                <meta property="og:title" content="Search For Playlist" />
                <meta
                    property="description"
                    content="Search for User's Playlist."
                />
                <meta
                    property="og:description"
                    content="Search for User's Playlist."
                />
                <meta property="theme-color" content="#4285f4" />
            </Head>
            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />

            <div className={styles.bgContainer}>
                <div className={styles.card}>
                    {id && (
                        <Link href={`/user/playlist/${id}`}>
                            <a>
                                <Button
                                    variant="outlined"
                                    className={styles.button}
                                >
                                    My Playlist
                                </Button>
                            </a>
                        </Link>
                    )}
                    <h3>Enter User Id of User</h3>
                    <TextField
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                        }}
                        type="number"
                        color="info"
                        label="User Id"
                        placeholder="Enter UserId"
                        variant="standard"
                        focused={true}
                    />
                    <Button
                        variant="outlined"
                        className={styles.button}
                        onClick={handleClick}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistIndex;
