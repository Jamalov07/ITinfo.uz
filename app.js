const mongoose = require("mongoose");
const config = require("config");
const express = require("express");

const app = express();
app.use(express.json());

const PORT = config.get("port");
const routes = require("./routes/index.routes");
app.use(routes);

async function start() {
    try {
        await mongoose.connect(config.get("dbAdr"));
        app.listen(PORT, () => {
            console.log(`Server ${PORT} portda ishga tushdi`);
        })
    } catch (error) {
        consolge.log("Serverda hatolik",error.message); 
    }
}

start();