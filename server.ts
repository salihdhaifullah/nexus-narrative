import type { Request, Response, NextFunction } from "express";
import path, { dirname } from "path";
import express from "express";
import compression from "compression";
import sirv from "sirv";
import { createServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolve = (p: string) => path.resolve(__dirname, p);
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

const app = express();
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "info",
  root: isProd ? "dist" : ""
});

app.use(vite.middlewares);
const assetsDir = resolve("public");

const requestHandler = express.static(assetsDir);
app.use(requestHandler);
app.use("/public", requestHandler);

if (isProd) {
  app.use(compression());
  app.use(sirv(resolve("client")));
}

const productionBuildPath = path.join(__dirname, "./server/entry-server.js");
const devBuildPath = path.join(__dirname, "./src/client/entry-server.tsx");
const buildModule = isProd ? productionBuildPath : devBuildPath;
const { render } = await vite.ssrLoadModule(buildModule);

app.use("*", async (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl;
  try {
    res.status(200).set({ "Content-Type": "text/html" }).end(await vite.transformIndexHtml(url, render(url)));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    !isProd && vite.ssrFixStacktrace(e);
    console.log(e.stack);
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => console.log(`Server started at http://localhost:${port}`))

