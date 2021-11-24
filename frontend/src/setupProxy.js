const cookiejar = require("cookiejar");
const { createProxyMiddleware } = require("http-proxy-middleware");
const zlib = require("zlib");
const cloudDotGovRouter = require("express").Router();

cloudDotGovRouter.use(
  (req, res, next) => {
    if (process.env.REACT_APP_ENV === "docker") {
      console.log("skip smeqa-staging.app.cloud.gov");
      return next("router");
    }
    console.log("going to smeqa-staging.app.cloud.gov");

    return next();
  },
  createProxyMiddleware({
    //protocolRewrite: true,
    logLevel: "debug",
    target: "https://smeqa-staging.app.cloud.gov/",
    changeOrigin: true,
    //cookieDomainRewrite: "localhost",
    secure: false,
    debug: true,
    xfwd: true,
    preserveHeaderKeyCase: true,
    followRedirects: true,
    selfHandleResponse: true,
    onProxyReq: relayRequestHeaders,
    onProxyRes: relayResponseHeaders,
    onError: onError,
  })
);
module.exports = function (app) {
  app.use(
    [
      "/login/auth",
      "/login/check",
      "/login/token",
      "/logout",
      "/api",
      "/serverInfo",
    ],
    cloudDotGovRouter
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://api:9000",
      changeOrigin: true,
    })
  );
};

function onError(err, req, res) {
  console.log(err);
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end(err);
}

function relayRequestHeaders(proxyReq, req) {
  console.log("Request Headers:");
  console.log(req.headers);
}

function relayResponseHeaders(proxyRes, req, res) {
  console.log("Response Headers:");
  console.log(proxyRes.headers);

  const cookieHeader = proxyRes.headers["set-cookie"];
  if (cookieHeader) {
    console.log(cookieHeader);
    res.set("set-cookie", cookieHeader);
  }

  let body = [];

  proxyRes.on("data", function (chunk) {
    body.push(chunk);
  });
  proxyRes.on("end", function () {
    // return res.end(Buffer.concat(body));
    // Staging isn't using zip...
    try {
      zlib.gunzip(Buffer.concat(body), (err, decoded) => {
        if (err) {
          console.error(err);
          res.end(err);
        } else {
          let str = decoded.toString("utf-8");
          console.log("res from proxied server:", str);
          res.end(decoded);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
}
