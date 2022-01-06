import Link from "next/link";
import styles from "../../styles/components/Navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu, MenuItem, Avatar } from "@mui/material";
import { MouseEvent, useState } from "react";
import dynamic from "next/dynamic";
import { clientId, redirectUri } from "../../constants";
import { useUserState, useUserStateDispatch } from "../../context";

const MenuButtons = dynamic(() => import("../dynamic/MenuButtons"), {
    loading: () => <div>Loading</div>,
});

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userState = useUserState();
    const dispatch = useUserStateDispatch();
    const open = Boolean(anchorEl);
    const handleClick = (
        event:
            | MouseEvent<
                  HTMLButtonElement | SVGElement | MouseEvent | HTMLDivElement
              >
            | any
    ) => {
        setAnchorEl((event as any).currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <nav className={styles.navigationContainer}>
            <div className={styles.logo}>
                <Avatar
                    src="https://cdn.discordapp.com/app-icons/838686966387965992/7dacaad77a7dc8083aee518157daa567.png?size=256"
                    sx={{ width: 60, height: 60 }}
                />
                <div className={styles.logoTextContainer}>
                    <span>PhantomKnight</span>
                </div>
            </div>
            <div className={styles.menuContainer}>
                <GiHamburgerMenu size={30} onClick={handleClick} />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <Link href="/">
                            <a style={{ color: "black" }}>Home</a>
                        </Link>
                    </MenuItem>
                    {userState.avatar ? (
                        <>
                            <Avatar
                                src={
                                    userState.avatar
                                        ? `https://cdn.discordapp.com/avatars/${userState.id}/${userState.avatar}.webp?size=1024`
                                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                                }
                                sx={{
                                    width: 50,
                                    height: 50,
                                }}
                                style={{
                                    cursor: "pointer",
                                }}
                                onClick={(e) => handleClick(e)}
                                className={styles.avatar}
                            />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={handleClick}>
                                    <Link href="/">
                                        <a
                                            style={{ color: "black" }}
                                            onClick={handleClick}
                                        >
                                            Home
                                        </a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleClick}>
                                    <Link
                                        href={`/user/playlist`}
                                    >
                                        <a style={{ color: "black" }}>
                                            Playlist
                                        </a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleClick}>
                                    <Link href="/guilds">
                                        <a style={{ color: "black" }}>Guilds</a>
                                    </Link>
                                </MenuItem>
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
                                                    discriminator: "",
                                                },
                                            });
                                            localStorage.removeItem("refresh");
                                        }}
                                    >
                                        Logout
                                    </span>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <MenuItem onClick={handleClose}>
                            <a
                                href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
                                    redirectUri
                                )}&response_type=code&scope=identify%20email%20guilds&prompt=none`}
                                style={{ color: "black" }}
                            >
                                Login
                            </a>
                        </MenuItem>
                    )}
                </Menu>
            </div>
            <MenuButtons />
        </nav>
    );
}
