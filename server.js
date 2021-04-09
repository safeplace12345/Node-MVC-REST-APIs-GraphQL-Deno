const http = require("http");

const server = http.createServer((req, res) => {
  let { url, method, headers } = req;
  console.log({ url, method, headers });
  // process.exit()
  res.setHeader("Content-Type", "text/html");
  res.write(`<html><body>Hello from Node Js !!!!!<body></html>`);
  res.end();
});

server.listen(3000);
