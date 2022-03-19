const path = require("path");

const withMDX = require("@next/mdx")({
    extension: /\.mdx?$/,
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});
module.exports = withMDX({
    // Append the default value with md extensions
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles/scss")],
    },
    images: {
        domains: ["cdn.discordapp.com", "i3.ytimg.com"],
    },
});
