/** @type {import('next').NextConfig} */
const path = require("path");
module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles/scss")],
    },
    images: {
        domains: ["cdn.discordapp.com","i3.ytimg.com"],
    },
};
