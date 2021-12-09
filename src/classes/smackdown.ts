import Canvas from "canvas";

export class Smackdown {
    /**
     * Smackdown
     * @param {imageurl1} string
     * @param {imageUrl2} string
     */
    async generateImage(imageurl1: string, imageUrl2: string) {
        const base = await Canvas.loadImage(
            `https://cdn.discordapp.com/attachments/867819380464680980/916658377503948820/11625052-1476532698-800.png`
        );
        const image1 = await Canvas.loadImage(imageurl1);
        const image2 = await Canvas.loadImage(imageUrl2);
        const canvas = Canvas.createCanvas(2048, 1024);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
        ctx.clearRect(1080, 10, 256, 310);
        ctx.clearRect(1090, 500, 256, 260);
        ctx.drawImage(image1, 1080, 10, 300, 310);
        ctx.drawImage(image2, 1090, 500, 300, 310);
        return canvas.toBuffer();
    }
}
