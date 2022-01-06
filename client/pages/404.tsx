import Head from "next/head";
import styles from "styles/scss/pages/404.module.scss";
import Link from "next/link";
function Custom404() {
    return (
        <div>
            <Head>
                <title>Page Not Found</title>
                <meta property="og:title" content="This Link Seems Broken" />
            </Head>
            <div className={styles.container}>
                It looks like you reached DeadEnd.
                <div>Here to Some Links to Help You</div>
                <div className={styles.linkContainer}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Custom404;
