import Head from "next/head";
import styles from "styles/scss/pages/404.module.scss";
import Link from "next/link";
function Custom404() {
    return (
        <div>
            <Head>
                <title>Page Not Found</title>
                <meta property="og:title" content="This Link Seems Broken" />
                <meta
                    property="description"
                    content="It looks like You Came to Dead End. This Link is Invalid"
                />
                <meta
                    property="og:description"
                    content="It looks like You Came to Dead End. This Link is Invalid"
                />
                <meta property="theme-color" content="#4285f4" />
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
