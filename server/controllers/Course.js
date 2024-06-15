const Course = require("../models/Course");
const Tag = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
  try {
    // fetch data from req body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    // course thumbnail
    const thumbnail = req.files.thumbnailImage;

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag Details Not Found",
      });
    }

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Tag
    const tagDetails2 = await Tag.findByIdAndUpdate(
      { _id: tag._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error("error in createCourse controller ", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({}, {
      courseName: true,
      price: true, thumbnail: true,
      instructor: true, ratingAndReviews: true,
      studentsEnrolled: true
    }).populate("instructor").exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully ",
      data: allCourses,
    });
  } catch (error) {
    console.log("error occured in getAllCourses controller ", error);
    return res.status(505).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};
