const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const router = require("./routes/index");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const encToken = "enctoken 1JxFt+1e1EB3UOvEnwFm7Lg1YlUgVd8ee+sRjRYx/oZqxVX0iFtqwCK1kR7YpT7CX3TpdGRqmQaU7H03xNs6HSvLcjxtQ5BSTnHJpeKXKM7JVeF2Qv4Txg==";

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
const port = 1234;

const fs = require("fs");
const csv = require('csvtojson');

async function findAndSaveIntrumentMapping() {
  const response = await axios.get("https://api.kite.trade/instruments", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: encToken,
    },
  });
  var jsonArray = await csv().fromString(response.data);
  const nseInstruments = jsonArray.filter(item => item.exchange === "BSE");
  fs.writeFile("bseDataMapping.json", JSON.stringify(nseInstruments, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Data successfully saved to data.json");
    }
  });
}

//find instruments and save as json file
//findAndSaveIntrumentMapping();

const { KiteApp } = require('./helper');
const enctoken = "OJ6TWZiKiIJgz6VDlDuJ6+PbRfpVmCg8ecSbb9hyk9VG6Nv4x7iFQJPtSh82kYeIaCANo/4PI9l9ZoRD8iX7Ft8wGPZ/t8O6p92sM177y4UbLF6gj44J0Q=="
async function getQuotes(){
  const kite = new KiteApp(enctoken);
  const data = await kite.quotes("INFY", "NSE");
    console.log(data);
  }

// getQuotes();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
