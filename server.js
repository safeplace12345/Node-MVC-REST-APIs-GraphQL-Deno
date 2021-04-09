const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let { url, method, headers } = req;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      `<html><body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">Send</button></form><body></html>`
    );
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
  return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message , () => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          return res.end();
      });
    });
  }
  // process.exit()
  res.setHeader("Content-Type", "text/html");
  res.write(`<html><body>Hello from Node Js !!!!!<body></html>`);
  res.end();
});

server.listen(3000);
