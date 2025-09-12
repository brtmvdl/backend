[![abackend](./images/abackend.png)](https://www.npmjs.com/package/abackend)

Easy Back-end Node.js library

[![NPM Downloads by package author](https://img.shields.io/npm-stat/dw/tarsislimadev?label=NPM%20Downloads)](https://www.npmjs.com/package/abackend) [![github/stars](https://img.shields.io/github/stars/tarsislimadev/abackend?style=social)](https://img.shields.io/github/stars/tarsislimadev/abackend?style=social) 

## donate

[Donate](https://link.mercadopago.com.br/brtmvdl)

## how to write an app

Watch on [Youtube](https://youtu.be/h1d-yo2yovk) how to get started with creating a new app using ABACKEND, following these steps:

### create a package.json file

```sh
# bash
npm init -y
```

### install ABACKEND

```sh
# bash
npm i abackend
```

### write your server

```js
// index.js

const { Server } = require('abackend')

const server = new Server()

server.get('/', (req, res) => res.setJSON({ id: Date.now() }))

server.listen(80).then(() => console.log(`Listenning on 80`))
```

### start your server

```sh
node index.js
```

## author

[@tarsislimadev](https://www.linkedin.com/in/tarsislimadev/)

## license

[MIT](./LICENSE)
