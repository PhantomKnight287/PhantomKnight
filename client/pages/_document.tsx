import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
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
                    <link
                        rel="icon"
                        href="https://cdn.discordapp.com/app-icons/838686966387965992/9666e404884a8e155df5e72cf6d3f491.png?size=256"
                    />
                    <meta
                        property="og:image"
                        content="https://cdn.discordapp.com/app-icons/838686966387965992/9666e404884a8e155df5e72cf6d3f491.png?size=256"
                    />
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
