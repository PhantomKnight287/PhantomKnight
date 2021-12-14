import styles from "../../styles/components/Footer.module.css";
import { SiNextdotjs } from "react-icons/si";
export default function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                Created in{" "}
                <SiNextdotjs size={30} style={{ margin: "0rem 0.5rem" }} /> by{" "}
                <a
                    href="https://github.com/PhantomKnight287"
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: "0.3rem" }}
                >
                    {" "}
                    PhantomKnight
                </a>
            </footer>
        </>
    );
}
