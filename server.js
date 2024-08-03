const express = require("express");
const errorHandler = require("./middleware.js/errorHandler");
const DBCONNECT = require("./database");



const PORT = process.env.PORT;
DBCONNECT();

const router = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", router);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
