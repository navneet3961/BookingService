const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./config/serviceConfig");
const db = require('./models/index');

const setupAndStartServer = async () => {
    const app = new express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(PORT, async () => {
        console.log(`Server has started at ${PORT}`);
        if (process.env.SYNC_DB) {
            db.sequelize.sync({ alter: true });
        }
    })
}

setupAndStartServer();