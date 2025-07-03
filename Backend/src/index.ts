import express from 'express';
import cors from "cors";
import removeBgRouter from "./routes/removeBg";

const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  console.log(`Request URL: ${req.method} ${req.url}`);
  next();
});

app.use(cors());

// Mount your upload route BEFORE express.json()
app.use("/removebg", removeBgRouter);

app.use(express.json());  // for other routes that accept json

app.listen(PORT, () => {
  console.log(`server is running on the PORT ${PORT}`);
});
