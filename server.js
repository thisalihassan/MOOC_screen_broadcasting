var port = process.env.PORT || 8001;

var server = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs");

function serverHandler(request, response) {
  try {
    // response.setHeader("Access-Control-Allow-Origin", true);
    // response.setHeader(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    // );

    // // Request headers you wish to allow
    // response.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
    // );
    // // Set to true if you need the website to include cookies in the requests sent
    // response.setHeader("Access-Control-Allow-Credentials", true);
    var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);

    var isWin = !!process.platform.match(/^win/);

    if (
      filename &&
      filename.toString().indexOf(isWin ? "\\room" : "/room") != -1 &&
      request.method.toLowerCase() == "post"
    ) {
      room(request, response);
      return;
    }
    if (filename && filename.search(/server.js/g) !== -1) {
      response.writeHead(404, {
        "Content-Type": "text/plain",
      });
      response.write("404 Not Found: " + path.join("/", uri) + "\n");
      response.end();
      return;
    }

    var stats;

    try {
      stats = fs.lstatSync(filename);
    } catch (e) {
      response.writeHead(404, {
        "Content-Type": "text/plain",
      });
      response.write("404 Not Found: " + path.join("/", uri) + "\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      response.writeHead(404, {
        "Content-Type": "text/html",
      });

      filename += "/index2.html";
    }

    fs.readFile(filename, "utf8", function (err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain",
        });
        response.write("404 Not Found: " + path.join("/", uri) + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "utf8");
      response.end();
    });
  } catch (e) {
    response.writeHead(404, {
      "Content-Type": "text/plain",
    });
    response.write(
      "<h1>Unexpected error:</h1><br><br>" + e.stack ||
        e.message ||
        JSON.stringify(e)
    );
    response.end();
  }
}

var app = server.createServer(serverHandler);

function runServer() {
  app = app.listen(port, process.env.IP || "0.0.0.0", function () {
    var addr = app.address();

    if (addr.address === "0.0.0.0") {
      addr.address = "localhost";
    }

    console.log("Server listening at http://" + addr.address + ":" + addr.port);
  });
}
function room(request, response) {
  try {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    console.log(body);
  } catch (err) {
    console.error(err.message);
  }
}
runServer();
