const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || "3000";
const HOST = process.env.HOST || "localhost";

exports.HOST = HOST;
exports.PORT = PORT;

const server = http.createServer(app);

console.log(
  `Server running at http://${HOST}:${PORT}/\nPress CTRL-C to stop`
);

server.listen(PORT, HOST);
