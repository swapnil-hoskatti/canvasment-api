const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "localhost";

const server = http.createServer(app);

console.log(`Server running at http://${HOST}:${PORT}/, ${process.env.HOST}, ${process.env.PORT}, ${process.env.JWT_KEY}`);

server.listen(PORT, "172.20.6.239");