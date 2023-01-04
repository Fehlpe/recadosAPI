import express from "express";
import cors from "cors";
import router from "./routes/routes";

const app = express();

const port = process.env.PORT || 8081;

app.use(express.json(), cors(), router);

app.listen(port, () => console.log("Servidor OK"));
