import Head from "next/head";
import styles from "styles/scss/servers/AutoMod.module.scss";
import axios from "axios";
import { backendUrl } from "@constants/index";
import { useRouter } from "next/router";
import { autoModConfig } from "types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Switch,
    CircularProgress,
    Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useUserState } from "@context/userContext";
function AutoMod() {
    const router = useRouter();
    const [enabled, setEnabled] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [config, setConfig] = useState<autoModConfig>({} as autoModConfig);
    const [words, setWords] = useState<string[]>([""]);
    const [newWord, setNewWord] = useState<string>("");
    const { id } = useUserState();
    const handleWordChange = async () => {
        const oldWords = words;
        oldWords.push(newWord);
        setWords(oldWords);
        setNewWord("");
        updateWords(oldWords);
    };
    function handleChange() {
        let requestRouter;
        if (enabled == true) {
            requestRouter = "disable";
        } else {
            requestRouter = "enable";
        }
        axios
            .post(`${backendUrl}${requestRouter}/${router.query.guildId}`)
            .then((res) => {
                toast.success(res.data.message);
                fetchData();
            })
            .catch((error) => {
                toast.error("An Error Occured!");
            });
    }
    async function fetchData() {
        axios
            .get(`${backendUrl}words/${router.query.guildId}`)
            .then((res) => {
                const configuration: autoModConfig = res.data.config;
                setConfig(configuration);
                setEnabled(configuration.enabled);
                setWords(configuration.words);
            })
            .catch((err) => {
                toast.error(
                    "An Error Occured While Fetching Data. Please Try Again Later!"
                );
            });
    }
    async function handleDelete(n: number) {
        const allWords = words;
        const newWords: string[] = [];
        allWords.map((word, index) => {
            if (index != n) {
                newWords.push(word);
            }
        });
        setWords(newWords);
        updateWords(newWords);
    }
    async function updateWords(wordsToUpdate: string[]) {
        axios
            .post(`${backendUrl}words/update/${router.query.guildId}`, {
                words: wordsToUpdate,
            })
            .then((res) => {
                if (!res.data.message) return;
                toast.success(res.data.message);
            })
            .catch(() => {
                toast.error("An Error Occured");
            });
    }
    useEffect(() => {
        if (!id) {
            router.push("/");
        }
        fetchData();
    }, []);

    if (!config) {
        return <CircularProgress />;
    }
    return (
        <div>
            <Head>
                <title>Manage AutoMod Configuration</title>
            </Head>
            <ToastContainer
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                hideProgressBar
            />
            <div>
                <div className={styles.container}>
                    <h1>Manage Automod For Your Server</h1>
                    <div className={styles.contentContainer}>
                        <div>
                            {enabled ? "Disable" : "Enable"} Automod For Your
                            Server
                            <Switch
                                checked={enabled}
                                className={styles.toggle}
                                onChange={() => {
                                    setOpen(true);
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            <Dialog
                                open={open}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Do you want to{" "}
                                    {enabled ? "disable" : "enable"} Automod for
                                    your server?
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Automod will check the message for any
                                        word which is blacklist and will delete
                                        the message.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setEnabled(!enabled);
                                            handleChange();
                                            setOpen(false);
                                        }}
                                        autoFocus
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                    {enabled ? (
                        <>
                            <div className={styles.containerDesc}>
                                <h1 className={styles.heading}>
                                    Configure Automod Settings For Your Server
                                </h1>
                                <input
                                    type="text"
                                    className={styles.input}
                                    onKeyDown={(e) => {
                                        if (e.key == "Enter") {
                                            handleWordChange();
                                        }
                                    }}
                                    value={newWord}
                                    onChange={(e) => {
                                        setNewWord(e.target.value);
                                    }}
                                />
                                <div className={styles.chipContainer}>
                                    {words
                                        ? words.map((word, index) => {
                                              return (
                                                  <Chip
                                                      key={index}
                                                      label={word}
                                                      style={{
                                                          outline: "none",
                                                          border: "none",
                                                          backgroundImage:
                                                              "linear-gradient(to right,#009FFF,#ec2F4B)",
                                                          fontWeight: "bold",
                                                          fontSize: "1rem",
                                                      }}
                                                      onDelete={() => {
                                                          handleDelete(index);
                                                      }}
                                                      variant="outlined"
                                                  />
                                              );
                                          })
                                        : null}
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default AutoMod;
