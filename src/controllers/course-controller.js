import courseService from "../services/course-service.js";
import { ResponseError } from "../errors/response-error.js";

const createCourse = async (req, res) => {
    try {
        const { uuid_user } = req.user || req.body;

        const newCourse = await courseService.createCourse(uuid_user, req.body);

        res.status(201).json(newCourse); 
    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.statusCode || 400).json({ errors: error.message });
        } else {
            console.error(error);
            res.status(500).json({ errors: "Internal Server Error" });
        }
    }
};

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses(req);

        res.status(200).json({
            data: courses.data,
            total: courses.total,
            totalPages: courses.totalPages,
            currentPage: courses.currentPage 
        });
    } catch (e) {
        next(e);
    }
};

const getCourseDetail = async (req, res) => {
    try {
        const { uuid_course } = req.params;
        const course = await courseService.getCourseDetail(uuid_course);

        res.status(200).json(course);
    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.statusCode || 400).json({ errors: error.message });
        } else {
            console.error(error);
            res.status(500).json({ errors: "Internal Server Error" });
        }
    }
};

const updateCourse = async (req, res) => {
    try {
        const { uuid_user } = req.user;
        const { uuid_course } = req.params;
        const courseData = req.body;

        const updatedCourse = await courseService.updateCourse(uuid_user, uuid_course, courseData);

        res.status(200).json(updatedCourse);
    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.statusCode || 400).json({ errors: error.message });
        } else {
            console.error(error);
            res.status(500).json({ errors: "Internal Server Error" });
        }
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { uuid_user } = req.user;
        const { uuid_course } = req.params;

        const response = await courseService.deleteCourse(uuid_user, uuid_course);

        res.status(200).json(response);
    } catch (error) {
        if (error instanceof ResponseError) {
            res.status(error.statusCode || 400).json({ errors: error.message });
        } else {
            console.error(error);
            res.status(500).json({ errors: "Internal Server Error" });
        }
    }
};

export default {
    createCourse,
    getAllCourses,
    getCourseDetail,
    updateCourse,
    deleteCourse
};
