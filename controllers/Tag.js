const Tag = require("../models/Tag");

exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create an entry in db
    const tagDetails = await Tag.create({ name, description });

    return res.status(200).json({
      success: true,
      message: "Tag create successfully",
    });
  } catch (error) {
    console.log("error in create tag controlller ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      allTags,
      message: "Tag create successfully",
    });
  } catch (error) {
    console.log("error in get all tag controlller ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
