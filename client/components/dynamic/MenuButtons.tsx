import { Menu, Avatar, MenuItem } from "@mui/material";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { clientId, redirectUri } from "../../constants";
import { useUserState, useUserStateDispatch } from "../../context";
import styles from "../../styles/components/Navbar.module.css";

export default function MenuButtons() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useUserStateDispatch();
    const open = Boolean(anchorEl);
    const handleClick = (
        event: MouseEvent<
            HTMLButtonElement | SVGElement | MouseEvent | HTMLDivElement
        >
    ) => {
        setAnchorEl((event as any).currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const userState = useUserState();
    return (
        <div
            className={
                userState.avatar
                    ? `${styles.linkContainerAvatar}`
                    : `${styles.linkContainer}`
            }
        >
            <Link href="/">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Home
                </a>
            </Link>
            {userState.avatar ? (
                <>
                    <Avatar
                        src={
                            userState.avatar
                                ? `https://cdn.discordapp.com/avatars/${userState.id}/${userState.avatar}.webp?size=1024`
                                : "https://cdn.discordapp.com/embed/avatars/0.png"
                        }
                        sx={{ width: 50, height: 50 }}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleClick(e)}
                    />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button"
                        }}
                    >
                        <MenuItem onClick={handleClose}>
                            <span
                                onClick={() => {
                                    dispatch({
                                        type: "SET_USER",
                                        payload: {
                                            avatar: "",
                                            id: "",
                                            username: "",
                                            email: "",
                                            discriminator: ""
                                        }
                                    });
                                }}
                            >
                                Logout
                            </span>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                    href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
                        redirectUri
                    )}&response_type=code&scope=identify%20email%20guilds&prompt=none`}
                >
                    Login
                </a>
            )}
        </div>
    );
}
