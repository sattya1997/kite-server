const express = require("express");
const router = express.Router();
const {
  getOrders, test, margins, placeOrder, modifyOrder, cancelOrder
} = require("../controllers/orderController");

const {
  login, twofa, userDetails,
} = require("../controllers/loginController");

const {
  getWatchlist,
} = require("../controllers/watchlistController")

const {
  getHistoricalData,
} = require("../controllers/chartController")

router.route("/getOrders").post(getOrders);
router.route("/test").get(test)
router.route("/login").post(login);
router.route("/twofa").post(twofa);
router.route("/userDetails").post(userDetails);
router.route("/marketWatch").post(getWatchlist);
router.route("/margins").post(margins);
router.route("/placeOrder").post(placeOrder);
router.route("/modifyOrder").post(modifyOrder);
router.route("/cancelOrder").post(cancelOrder);
router.route("/getHistoricalData").post(getHistoricalData);

module.exports = router;