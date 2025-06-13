const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios");

exports.getWatchlist = catchAsyncErrors(async (req, res) => {
  const { id, token } = req.body;
  // try {
  //   const response = await axios.get(
  //     `https://kite.zerodha.com/api/marketwatch/${id}/items`,
  //     {
  //       headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": token,
  //       "accept-encoding": "gzip, deflate, br, zstd",
  //       "kf_session": "rwbkr4UQ7i9OceCVHRN5vbFQgwUIumn5",
  //       "user_id": "KAH660",
  //       "public_token": "0bSd4f8P41drwdkAir0ACT6DpaAWo7ck",
  //       "__cf_bm": "9E2HhZOV5UqHH0rGMJm_Tm2QvtRg6zdajE8dwZNO1Dk-1749467908-1.0.1.1-2UwPLLIvtzIH9DJp6CNBSn.5X1qERplIlN0FtF6fR0eDoOw752HVznMPjfs3UkRA4G2bG0O9HP6s.b92uKxtsrL5zBOu7UeBdZNJKQFPZUE",
  //       "cfuvid": "6FNhGs2rXL8OenBxeEj4DRKk_k.ABLcCkyuel1kRo0M-1749467908012-0.0.1.1-604800000"
  //     },
  //     }
  //   );
  //   return res.status(200).json(response.data);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(200).json({status: "error"});
  // }
  return res.status(200).json({status: "error"});
});
