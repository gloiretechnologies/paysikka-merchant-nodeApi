const notifications = require("../model/notification");

exports.getnotifications = async (req, res) => {
  try {
    const data = await notifications.find({ userid: req.AuthId, type: "MU" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json(error);
  }
};
