import styles from "styles/scss/servers/Welcome.module.scss";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import {
    Switch,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { backendUrl } from "constants/index";
import { useRouter } from "next/router";
import {
    welcomeConfig as welcomeConfigType,
    welcomeConfigurationState,
    channels as channelsType,
} from "types";
import { Picker } from "emoji-mart";
import { BsEmojiLaughingFill } from "react-icons/bs";
export default function Welcome() {
    const [enabled, setEnabled] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [welcomeConfig, setWelcomeConfig] =
        useState<welcomeConfigurationState>({} as welcomeConfigurationState);
    const [newMessage, setnewMessage] = useState("");
    const [showEmojiPanel, setShowEmojiPanel] = useState(false);
    const [channels, setChannels] = useState<channelsType>([] as channelsType);
    const [welcomeChannel, setWelcomeChannel] = useState<{
        id: string;
        name: string;
    }>({ id: "", name: "Welcome " });
    const router = useRouter();
    const update = () => {
        if (welcomeConfig && !welcomeConfig.channelId) {
            return toast.error("Please Select A Channel To Send Message");
        }
        if (!welcomeConfig) {
            if (!newMessage) {
                return toast.error("Please Type A Message.");
            }
        }
        if (!welcomeConfig?.channelId && !welcomeChannel.id) {
            console.log(welcomeChannel);
            return toast.error("Please Select A Channel To Send Message!");
        }
        axios
            .post(`${backendUrl}welcome/update/${router.query.guildId}`, {
                channelId: welcomeChannel?.id,
                enabled,
                welcomerMessage: newMessage,
            })
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch(() => {
                toast.error("An Error Occured!");
            });
    };
    const fetchChannels = () => {
        axios
            .get(`${backendUrl}welcome/channels/${router.query.guildId}`)
            .then((res) => {
                let channelName: string;
                res.data.channels.forEach((channelData: any) => {
                    if (channelData.id == welcomeChannel.id) {
                        channelName = channelData.name;
                    }
                });
                // console.log(channelName);
                setChannels(res.data.channels);
                setWelcomeChannel((data) => {
                    data.name = channelName;
                    return data;
                });
                // console.log(welcomeChannel);
            })
            .catch(() => {
                toast.error(
                    "An Error Occured When Fetching Channels. Please Try Again Later."
                );
            });
    };

    const handleChange = () => {
        axios
            .post(
                `${backendUrl}welcome/${enabled ? "disable" : "enable"}/${
                    router.query.guildId
                }`
            )
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((_) => {
                toast.error("An Error Occured");
            });
    };

    useEffect(() => {
        if (!router.isReady) return;
        axios
            .get(`${backendUrl}welcome/${router.query.guildId}`)
            .then((res) => {
                // console.log(res.data);
                const data: welcomeConfigType = res.data;
                setEnabled(data.enabled);
                if (data.config != undefined) {
                    setWelcomeConfig(data.config);
                    setnewMessage(data.config.welcomerMessage);
                    setWelcomeChannel({ id: data.config.channelId, name: "" });
                }
            })
            .catch((err: AxiosError) => {
                console.log(err.response?.data);
                toast.error("An Error Occured. Please Try again later.");
            });
        fetchChannels();
    }, [router.isReady]);

    return (
        <>
            <Head>
                <title>Manage Welcome Message Configuration</title>
            </Head>
            <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
            <div style={{ paddingBottom: "3rem" }}>
                <div className={styles.container}>
                    <h1>
                        Manage Welcome Message Configuration For Your Server
                    </h1>
                    <div className={styles.contentContainer}>
                        <div>
                            {enabled ? "Disable" : "Enable"} Welcome Message For
                            Your Server
                            <Switch
                                checked={enabled}
                                className={styles.toggle}
                                inputProps={{ "aria-label": "controlled" }}
                                onChange={() => {
                                    setOpen(true);
                                }}
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
                                    {enabled ? "Disable" : "Enable"} Welcome
                                    Message for your server?
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText
                                        id="alert-dialog-description"
                                        style={{ textAlign: "center" }}
                                    >
                                        Welcome Message Will Send A Message In
                                        Specified Channel When A User Join The
                                        Server
                                        {!enabled && (
                                            <Image
                                                src="/welcomeMessage.png"
                                                alt="Welcome Message"
                                                width={1080}
                                                height={400}
                                            />
                                        )}
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
                                    Configure Welcome Module Settings For Your
                                    Server
                                </h1>
                                <span style={{ paddingBottom: "1rem" }}>
                                    <kbd>|guild|</kbd> will be replaced by your
                                    server&apos;s name <br />
                                    <kbd>|user|</kbd> will be replace by
                                    username of new user. <br />
                                    These <code>|</code> are mandatory
                                </span>
                                <div className={styles.inputBoxContainer}>
                                    <textarea
                                        className={styles.input}
                                        value={newMessage}
                                        onChange={(e) => {
                                            setnewMessage(e.target.value);
                                        }}
                                        style={{
                                            marginBottom: "0px",
                                        }}
                                        rows={5}
                                    />
                                    <BsEmojiLaughingFill
                                        color="grey"
                                        onClick={() => {
                                            setShowEmojiPanel(!showEmojiPanel);
                                        }}
                                        size={30}
                                        cursor="pointer"
                                    />
                                </div>
                                {showEmojiPanel && (
                                    <Picker
                                        set="google"
                                        title="Pick your emoji…"
                                        emoji="point_up"
                                        exclude={["flags"]}
                                        style={{
                                            marginTop: "1rem",
                                        }}
                                        theme="dark"
                                        onSelect={(e) => {
                                            setnewMessage(
                                                `${newMessage} ${e.colons}`
                                            );
                                        }}
                                    />
                                )}

                                <label htmlFor="ChannelName">
                                    Select A Channel To Send Message
                                </label>
                                <select
                                    name="channel"
                                    id="serverChannels"
                                    defaultValue={welcomeChannel.name}
                                    className={styles.selectMenu}
                                    onChange={(e) => {
                                        setWelcomeChannel((d) => {
                                            d.id = e.target.value;
                                            return d;
                                        });
                                    }}
                                >
                                    {channels
                                        ? channels.map((guildChannel, i) => {
                                              return (
                                                  <option
                                                      key={i}
                                                      value={guildChannel.id}
                                                  >
                                                      {guildChannel.name}
                                                  </option>
                                              );
                                          })
                                        : null}
                                </select>
                                <Button
                                    variant="contained"
                                    style={{
                                        marginTop: "2rem",
                                    }}
                                    className={styles.button}
                                    onClick={update}
                                >
                                    Update
                                </Button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
}
