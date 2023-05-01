const express = require("express");
const route = express.Router();
const verify = require("./verifytoken");

const usercontroller = require("../controller/users");
const dashboardController = require("../controller/dashboard");
const outletcontroller = require("../controller/outlets");
const promotioncontroller = require("../controller/promotions");
const notificationcontroller = require("../controller/notification");

// Api routes

route.post("/register", usercontroller.register);
route.post("/registerverifyotp", usercontroller.registrationverifyotp);
route.post("/login", usercontroller.login);
route.post("/verifyotp", usercontroller.verifyotp);
route.put("/logout", verify, usercontroller.logout);
route.get("/checking", usercontroller.checking);

// routes with verify token

route.post("/profileupdate", verify, usercontroller.profileupdate);
route.get("/profile", verify, usercontroller.profile);
// routes with merchant bank details
route.post(
  "/merchantbankdetails",
  verify,
  usercontroller.storemerchantbankdetails
);
route.get("/merchantbankdetails", verify, usercontroller.merchantbankdetails);
route.delete("/merchantbankdetails/:id",verify,usercontroller.removemerchantbankdetails);

route.post(
  "/setprimarybankdetails/:id",
  verify,
  usercontroller.setprimarybankdetails
);
// routes with dashboard apis
route.get("/dashboard/transactions", verify, dashboardController.transactions);
route.get("/dashboard/totalamount", verify, dashboardController.totalamount);
route.get("/dashboard/recharges", verify, dashboardController.recharges);
route.get(
  "/dashboard/totalwalletpoints",
  verify,
  dashboardController.totalwalletpoints
);
route.get(
  "/dashboard/collectedwalletpoints",
  verify,
  dashboardController.collectedwalletpoints
);
// routes with outlet apis
route.post("/outlet/register", verify, outletcontroller.outletregister);
route.post(
  "/outlet/verifyotp",
  verify,
  outletcontroller.outletregistrationverifyotp
);
route.get("/outlet/list", verify, outletcontroller.outlets);
route.get(
  "/outlet/transactions/:id",
  verify,
  outletcontroller.outlettransactios
);
// routes with promotion apis
route.get("/promotions/list", verify, promotioncontroller.getpromotiontypes);
route.get("/promotions/list/:id", verify, promotioncontroller.getpromotiontype);
route.get(
  "/promotions/packages",
  verify,
  promotioncontroller.promotionpackageswithtype
);
route.get(
  "/promotions/package/:id",
  verify,
  promotioncontroller.packagesbypromotions
);
route.post("/promotions/purchase", verify, promotioncontroller.content);
route.get("/promotions/purchaselist", verify, promotioncontroller.purchaselist);

// routes with notifications
route.get("/notifications", verify, notificationcontroller.getnotifications);

module.exports = route;
