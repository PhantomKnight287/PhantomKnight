import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext
} from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta
                        name="description"
                        content="An Open Source Discord Bot with moderation, Music,Music Playlist Support, Leveling, Image Manipulation, Webhook Emojis and many more things."
                    />
                    <meta
                        name="og:description"
                        content="An Open Source Discord Bot with moderation, Music,Music Playlist Support, Leveling, Image Manipulation, Webhook Emojis and many more things."
                    />
                    <link
                        rel="icon"
                        href="https://cdn.discordapp.com/app-icons/838686966387965992/7dacaad77a7dc8083aee518157daa567.png?size=256"
                    />
                    <meta
                        property="og:image"
                        content="https://cdn.discordapp.com/app-icons/838686966387965992/7dacaad77a7dc8083aee518157daa567.png?size=256"
                    />
                    <meta property="theme-color" content="#4285f4" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
