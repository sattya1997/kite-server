const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require("axios");
const { KiteApp } = require('../helper');

exports.getOrders = catchAsyncErrors(async (req, res) => {
  try {
    const {token} = req.body;
    const response = await axios.get("https://kite.zerodha.com/oms/orders", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "enctoken " + token,
      },
    });
      return res.status(200).json(response.data)
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response ? error.response.data : error.message
    );
    return res.status(403).json({status: "error", data: error.data})
  }
});

exports.margins = catchAsyncErrors(async (req, res) => {
  const {token} = req.body;
  try {
    const response = await axios.get(
      "https://kite.zerodha.com/oms/user/margins",
      {
        headers: {
        "Content-Type": "application/json",
        "Authorization": "enctoken " + token,
      },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error)
    return res.status(404).json({status: "error"});
  }
});

exports.placeOrder = catchAsyncErrors(async (req, res) => {
  const {variety, transaction_type, exchange, tradingsymbol, quantity, order_type, product, price, token} = req.body;
  const kite = new KiteApp(token);
  const order = await kite.place_order(variety, exchange, tradingsymbol, transaction_type, quantity, product, order_type, price);
  return res.status(200).json({status: "success", order: order});
});

exports.test = catchAsyncErrors(async (req, res) => {
  console.log("req order" + req);
  return res.status(200).json({
    message: "all ok",
    success: true,
  });
});

exports.modifyOrder = catchAsyncErrors(async (req, res) => {
  const {token, order_id, variety, transaction_type, exchange, tradingsymbol, quantity, order_type, product, price, user_id, tag} = req.body;
  const kite = new KiteApp(token);
  const order = await kite.modify_order(variety, order_id, null, quantity, price, order_type);
  return res.status(200).json({status: "success", order: order});
})

exports.cancelOrder = catchAsyncErrors(async (req, res) => {
  const {token, order_id, variety} = req.body;
  const kite = new KiteApp(token);
  const order = await kite.cancel_order(variety,order_id);
  return res.status(200).json({status: "success", order: order});
})

// exports.registerUser = catchAsyncErrors(async (req, res) => {
//   const { name, email, password, profilePic } = req.body;

//   const checkEmail = await UserModel.findOne({ email });

//   if (checkEmail) {
//     return res.status(400).json({
//       message: "User already exists",
//       error: true,
//     });
//   }

//   const salt = await bcryptjs.genSalt(10);
//   const hashPassword = await bcryptjs.hash(password, salt);

//   const user = new UserModel({
//     name,
//     email,
//     password: hashPassword,
//     profilePic,
//   });

//   const userSave = await user.save();

//   return res.status(201).json({
//     message: "user created successfully",
//     user: userSave,
//     success: true,
//   });
// });

// // login
// exports.login = catchAsyncErrors(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await UserModel.findOne({ email });

//   if (!user) {
//     return res.status(400).json({
//       message: "user not exist",
//       error: true,
//     });
//   }

//   const verifyPassword = await bcryptjs.compare(password, user.password);

//   if (!verifyPassword) {
//     return res.status(400).json({
//       message: "wrong password",
//       error: true,
//     });
//   }

//   sendToken(user, 200, res);
// });

// // logout
// exports.logout = catchAsyncErrors(async (req, res) => {
//   const cookieOptions = {
//     http: true,
//     secure: true,
//     samesite: "None",
//   };

//   return res.cookie("token", "", cookieOptions).status(200).json({
//     message: "logout successfully",
//     succes: true,
//   });
// });

// // user details
// exports.userDetails = catchAsyncErrors(async (req, res) => {
//   return res.status(200).json({
//     message: "user details",
//     user: req.user,
//   });
// });

// // update user
// exports.updateUser = catchAsyncErrors(async (req, res) => {
//   const { userId, name, profilePic } = req.body;

//   const updateuser = await UserModel.updateOne(
//     { _id: userId },
//     { name, profilePic }
//   );

//   if (updateuser?.modifiedCount == 1) {
//     const user = await UserModel.findById(userId);

//     return res.status(200).json({
//       message: "user udpated successfully",
//       user,
//       success: true,
//     });
//   } else {
//     return res.status(400).json({
//       message: "user not udpated",
//       error: true,
//     });
//   }
// });

// // search user
// exports.searchUser = catchAsyncErrors(async (req, res) => {
//   const { search } = req.body;

//   const query = new RegExp(search, "i", "g");
//   const users = await UserModel.find({
//     $or: [{ name: query }, { email: query }],
//   }).select("-password");

//   return res.status(200).json({
//     message: "all users",
//     users,
//     success: true,
//   });
// });

// exports.getAllUsers = catchAsyncErrors(async (req, res) => {
//   const users = await UserModel.find({}).select("-password");
//   return res.status(200).json({
//     message: "all users",
//     users,
//     success: true,
//   });
// });

// exports.getAllConv = catchAsyncErrors(async (req, res) => {
//   const params = req.query;
//   const sendConv = await getConversation(params.user);
//   return res.status(200).json(sendConv || []);
// });
