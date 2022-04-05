<div > 
<div align="center">
# PhantomKnight - A Discord Bot

[![GNU Licence](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.en.html)

<br/>
<br/>
<img style="margin-bottom:1rem" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"></img>
<br/>
<br/>

[![Discord Bots](https://top.gg/api/widget/838686966387965992.svg)](https://top.gg/bot/838686966387965992)

Click [here](https://bot.phantomknight.tk/docs) to see list of commands.
</div>

# Instructions

[Git](https://git-scm.com/downloads), [Nodejs](https://nodejs.org) and FFmpeg must be installed on your system

1. Clone the Repo
```
git clone https://github.com/PhantomKnight287/Phantomknight
```
2. Install dependencies
```bash
npm i 
 or
yarn
```
3. Setting up Environment Variables
    Create .env in root of the folder and follow `.env.example` for variables.
4. Compile Ts
```
yarn build:prod
or 
npm run build:prod
```
5. Start the bot
```
npm run start:prod
or
yarn start:prod
```

- Run The bot Using Docker
<br/>
Get `docker-compose.yml` from root of the project. Follow Step 3 from above and run

```bash
docker-compose up --build --detach
```

![separator](https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif)

<details>
<summary>Reference</summary>
<br/>
<a href="https://github.com/hackarmour/discord-assistant-js">Command Handler</a><br/>
<a href="https://github.com/tatupesonen/formatbot">Idea to Use Typescript and Docker</a><br/>
<a href="https://github.com/Androz2091/discord-music-bot">Music Commands </a>
</details>
</div>