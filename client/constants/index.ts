export const redirectUri =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://bot.phantomknight.tk/";
export const clientId =
    process.env.NODE_ENV === "development"
        ? "839849142925656064"
        : "838686966387965992";
export const backendUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://kekw.loca.lt/";
