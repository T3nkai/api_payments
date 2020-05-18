
/**
 * nesessari instalar o memcached
 * linux
 * sudo apt install memcached
 * 
 */
const dotenv = require('dotenv');
dotenv.config();

const app = require('./config/custon_express')()

const port = process.env.PORT;

app.listen(port, () => {
console.log('Servidor rodando na porta '+port)
});