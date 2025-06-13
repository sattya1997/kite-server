const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { KiteApp } = require('../helper');

exports.getHistoricalData = catchAsyncErrors(async (req, res) => {
  const {token, instrument_token, from, to, interval} = req.body;
  const kite = new KiteApp(token);
  const historicalData = await kite.historical_data(parseInt(instrument_token), from, to, interval);
  return res.status(200).json({status: "success", historicalData: historicalData});
}); 