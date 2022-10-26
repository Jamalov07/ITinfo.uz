const path = require("path");

const createViewPath = (page) =>
  path.resolve(__dirname, "../views", `${page}.ejs`);

module.exports = {
  createViewPath,
};
