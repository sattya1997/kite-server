const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios");

const qs = require("qs");

exports.login = catchAsyncErrors(async (req, res) => {
  const { userId, password } = req.body;
  if (
    userId === null ||
    password === null ||
    userId === undefined ||
    password === undefined ||
    userId === "" ||
    password === ""
  ) {
    return res.status(200).json({
      stat: "not_ok",
    });
  }

  const userData = qs.stringify({
    user_id: userId,
    password: password,
    type: "user_id",
  });
  const response = await axios.post(
    "https://kite.zerodha.com/api/login",
    userData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.status(200).json(response.data);
});

exports.twofa = catchAsyncErrors(async (req, res) => {
  const { userId, totp, reqId } = req.body;

  const userData = qs.stringify({
    user_id: userId,
    request_id: reqId,
    twofa_value: totp,
    twofa_type: "totp",
  });
  const response = await axios.post(
    "https://kite.zerodha.com/api/twofa",
    userData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  
  const cookie = response.headers['set-cookie'];
  console.log(cookie);
  if (cookie) {
    var encToken = cookie.find((item) => item.startsWith("enctoken="));
    encToken = encToken.split(";")[0].split("=")[1];
    if (encToken && encToken.length > 20) {
      return res.status(200).json({status: "success", encToken: encToken});
    } else {
      return res.status(200).json({status: "error"});
    }
  } else {
    return res.status(200).json({status: "error"});
  }
  ;
});

exports.userDetails = catchAsyncErrors(async (req, res) => {
  const { token } = req.body;
  const response = await fetchZerodhaProfile(token);
  return res.status(200).json(response);
});

async function fetchZerodhaProfile(token) {
  const response = await axios.get(
    "https://kite.zerodha.com/oms/user/profile",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "enctoken " + token,
      },
    }
  );
  return response.data;
}
