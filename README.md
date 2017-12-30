## Sugar for CNodejs.org

Material UI version of cnodejs.org. Demo:[ http://cnodejs.sugarac.com](http://cnodejs.sugarac.com)

### Tech Stack

Frontend: ES6 + React 16 + React Router + Mobx + Webpack + axios  
Backend: AWS + Nginx + Express + PM2

### Run at Localhost

```
git clone https://github.com/sugarac/react-cnodejs.org
cd react-cnodejs.org
npm i
npm run build
visit localhost:3333 at your browser
```

### Run at Cloud Server \(Linux\)

```
sudo su
cd ~
mkdir projects
git clone https://github.com/sugarac/react-cnodejs.org
cd react-cnodejs.org
npm i
pm2 start process.yml
visit your server's public IP or bound domain at your browser
```

### Code Tree

```
├─ build
│  ├─ upload.js
│  ├─ webpack.base.js
│  ├─ webpack.config.client.js
│  └─ webpack.config.server.js
├─ client
│  ├─ components
│  │  └─ simple-mde
│  │     ├─ generator-id.js
│  │     ├─ id-generator.js
│  │     └─ index.jsx
│  ├─ config
│  │  └─ router.jsx
│  ├─ store
│  │  ├─ app-state.js
│  │  ├─ index.js
│  │  ├─ redux-and-mobx.js
│  │  └─ topic-store.js
│  ├─ util
│  │  ├─ date-format.js
│  │  ├─ http.js
│  │  └─ variable-define.js
│  ├─ views
│  │  ├─ components
│  │  │  ├─ app-bar.jsx
│  │  │  ├─ container.jsx
│  │  │  └─ routes.jsx
│  │  ├─ topic-create
│  │  │  ├─ index.jsx
│  │  │  └─ styles.js
│  │  ├─ topic-detail
│  │  │  ├─ index.jsx
│  │  │  ├─ reply.jsx
│  │  │  └─ styles.js
│  │  ├─ topic-list
│  │  │  ├─ index.jsx
│  │  │  └─ styles.js
│  │  ├─ user
│  │  │  ├─ styles
│  │  │  │  ├─ bg.jpg
│  │  │  │  ├─ login-style.js
│  │  │  │  ├─ user-info-style.js
│  │  │  │  └─ user-style.js
│  │  │  ├─ info.jsx
│  │  │  ├─ login.jsx
│  │  │  └─ user.jsx
│  │  └─ App.jsx
│  ├─ .eslintrc
│  ├─ app.js
│  ├─ server-entry.js
│  ├─ server.template.ejs
│  └─ template.html
├─ server
│  ├─ util
│  │  ├─ dev-static.js
│  │  ├─ inject-token.js
│  │  ├─ server-render.js
│  │  └─ user-api.js
│  └─ server.js
├─ .babelrc
├─ .editorconfig
├─ .eslintrc
├─ README.md
├─ app.config.js
├─ ecosystem.json
├─ favicon.ico
├─ package.json
└─ process.yml

```



