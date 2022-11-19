const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const { winstonLogger, errLogger } = require("./middleware/loggerMiddleware");
const routes = require("./routes/index.routes");
const exHbs = require("express-handlebars");
const PORT = config.get("port");
const frontRoutes = require("./routes/front.routes");
const front = require("./front.routes/index.routes");
const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
}); 
app.engine("hbs", hbs.engine);
app.set("View engine", "hbs");
app.set("views", "views");
app.use(express.static("views"));
app.use(front);

app.use(express.json()); // front dan kelayotgan so'rovlarni json ko'rinishiga o'tkazib beradi
app.use(cookieParser());
app.use(frontRoutes);
// app.use(winstonLogger);
app.use(routes);
// app.use(errLogger);
app.use(errorHandler);


async function start() {
  try {
    await mongoose.connect(config.get("dbAdr"));
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portda ishga tushdi`);
    });
  } catch (error) {
    consolge.log("Serverda hatolik", error.message);
  }
}

start();
