const http = require("http");

const server = http.createServer((req, res) => {
  let { url, method, headers } = req;
if(url === "/"){
    res.setHeader("Content-Type", "text/html");
    res.write(`<html><body><form action="/message"><input type="text" name="message"/><button type="submit">Send</button></form><body></html>`);
   return res.end();
}
  // process.exit()
  res.setHeader("Content-Type", "text/html");
  res.write(`<html><body>Hello from Node Js !!!!!<body></html>`);
  res.end();
});

server.listen(3000);
