import Link from "next/link";
import styles from "../../styles/components/Navbar.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu, MenuItem, Avatar } from "@mui/material";
import { MouseEvent, useState } from "react";
import dynamic from "next/dynamic";
const MenuButtons = dynamic(() => import("../dynamic/MenuButtons"), {
    loading: () => <div>Loading</div>
});

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (
        event: MouseEvent<HTMLButtonElement | SVGElement | MouseEvent>
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
                        "aria-labelledby": "basic-button"
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/poetry">
                            <a>Poetry</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/videos">
                            <a>Videos</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/">
                            <a>Gallery</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/about">
                            <a>About</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/">
                            <a>Book A Show</a>
                        </Link>
                    </MenuItem>
                </Menu>
            </div>
            <MenuButtons />
        </nav>
    );
}
