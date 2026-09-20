import express from "express";

const app = express();
const port = 3000;

app.get("/", (req:Request , res:Response) => {
  res.send("Hello World!");
});

app.get("/home", (req:Request, res:Response) => {
    res.send("this is another type of thing dude")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});