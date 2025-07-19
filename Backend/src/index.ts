import express from 'express';
import cors from "cors";
import removeBgRouter from "./routes/removeBg";

const app = express();
const PORT = 5000;
const allowedOrigins = [
  "http://localhost:3000",
  "https://bg-remover-ai-ten.vercel.app",
];
app.use((req, res, next) => {
  console.log(`Request URL: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: function (origin, callback){
    if(!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    }else{
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Mount your upload route BEFORE express.json()
app.use("/removebg", removeBgRouter);

app.use(express.json());  
app.listen(PORT, () => {
  console.log(`server is running on the PORT ${PORT}`);
});
