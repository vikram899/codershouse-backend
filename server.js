const express = require("express");
const { errorHandler } = require("./middleware");
const DBCONNECT = require("./database");
const cors = require("cors");
const router = require("./routes");
const { FRONTEND_URL, PORT } = require("./config");
const cookieParser = require("cookie-parser");

DBCONNECT();
const app = express();

app.use(cookieParser());
app.use(cors({ origin: [FRONTEND_URL], credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use("/api", router);
app.use(errorHandler);
app.use('/storage', express.static('storage'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
