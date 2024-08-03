const express = require("express");
const errorHandler = require("./middleware.js/errorHandler");

const router = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
