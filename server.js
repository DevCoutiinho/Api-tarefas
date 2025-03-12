import express from "express";
import cors from "cors";
import publicRoutes from "./routes/publicRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import auth from "./middlewares/auth.js";
import refreshRoute from "./routes/refreshRoute.js";
import userRoute from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin === "https://seu-dominio.com"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/", publicRoutes);
app.use("/", refreshRoute);
app.use("/tarefas", auth, tasksRoutes);
app.use("/usuario", auth, userRoute);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
