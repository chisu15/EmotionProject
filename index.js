const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./configs/db");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/uploads/", express.static(path.join(__dirname, "uploads")));
db.connect();

// ROUTE
const route = require("./routes/index.route");
route(app);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
