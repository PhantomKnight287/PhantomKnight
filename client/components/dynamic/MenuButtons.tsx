import Link from "next/link";
import styles from "../../styles/components/Navbar.module.css";

export default function MenuButtons() {
    return (
        <div className={styles.linkContainer}>
            <Link href="/">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Home
                </a>
            </Link>
            <Link href="/poetry">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Poetry
                </a>
            </Link>
            <Link href="/videos">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Videos
                </a>
            </Link>
            <Link href="/">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Gallery
                </a>
            </Link>
            <Link href="/about">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    About
                </a>
            </Link>
            <Link href="/">
                <a
                    className={`${styles["hvr-underline-from-center"]} ${styles.anchor}`}
                >
                    Book A Show
                </a>
            </Link>
        </div>
    );
}
