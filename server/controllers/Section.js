const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, courseId } = req.body;

        // Validate  
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }

        // Create a new section 
        const newSection = await Section.create({ sectionName });

        // update course's content 
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        // Return  updated course  
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });
    } catch (error) {
        console.error("error in createSection controller ", error);
        res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: error.message,
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        // data input
        const { sectionName, sectionId } = req.body;


        // data validation 
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }


        // update data  
        const section = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );


        // const course = await Course.findById(courseId)
        //     .populate({
        //         path: "courseContent",
        //         populate: {
        //             path: "subSection",
        //         },
        //     })
        //     .exec();

        res.status(200).json({
            success: true,
            message: "Section update successfully ",
            // data: course,
        });
    } catch (error) {
        console.error("error in updateSection controller ", error);
        res.status(500).json({
            success: false,
            message: "Failed to update  section",
            error: error.message,
        });
    }
};


exports.deleteSection = async (req, res) => {
    try {

        // test with request.params
        const { sectionId } = req.params;


        await Section.findByIdAndDelete(sectionId);

        //TODO : delete entry from course schema

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            // data: course
        });
    } catch (error) {
        console.error("error in deleteSection controller ", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete  section",
            error: error.message,
        });
    }
};   