import { validate } from "../validations/validation.js";
import { courseValidation } from "../validations/course-validation.js";
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";

const createCourse = async (uuid_user, courseData) => {
    const validatedData = validate(courseValidation, courseData);
    
    if (!validatedData) {
        throw new ResponseError(400, "Invalid course data");
    }

    if (!uuid_user) {
        throw new ResponseError(400, "User UUID is required");
    }

    const user = await prismaClient.user.findUnique({
        where: { uuid_user: uuid_user },
        select: { role: true }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    if (user.role !== "INSTRUCTOR") {
        throw new ResponseError(403, "Forbidden: Only instructors can create courses");
    }

    const newCourse = await prismaClient.course.create({
        data: {
            title: validatedData.title,
            description: validatedData.description,
            instructorUuid: uuid_user, 
        }
    });

    return newCourse;
};

const getAllCourses = async (req) => {
    let { page = 1, limit = 10 } = req.query;

    page = isNaN(page) ? 1 : Math.max(1, parseInt(page));
    limit = isNaN(limit) ? 10 : Math.max(1, parseInt(limit));

    const skip = (page - 1) * limit;

    try {
        const totalCourses = await prismaClient.course.count();

        const courses = await prismaClient.course.findMany({
            skip,
            take: limit,
            select: {
                id_course: true,
                uuid_course: true,
                title: true,
                description: true,
                created_at: true,
                updated_at: true,
                instructor: {
                    select: {
                        uuid_user: true,
                        name: true
                    }
                }
            },
        });

        return {
            data: courses,
            total: totalCourses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw new Error("Error fetching courses");
    }
};

const getCourseDetail = async (uuid_course) => {
    const course = await prismaClient.course.findUnique({
        where: { uuid_course },
        select: {
            id_course: true,
            uuid_course: true,
            title: true,
            description: true,
            created_at: true,
            updated_at: true,
            instructor: {
                select: {
                    uuid_user: true,
                    name: true
                }
            }
        },
    });

    if (!course) {
        throw new ResponseError(404, "Course not found");
    }

    return course;
};

const updateCourse = async (uuid_user, uuid_course, courseData) => {
    const validatedData = validate(courseValidation, courseData);
    
    if (!validatedData) {
        throw new ResponseError(400, "Invalid course data");
    }

    const existingCourse = await prismaClient.course.findUnique({
        where: { uuid_course },
    });

    if (!existingCourse) {
        throw new ResponseError(404, "Course not found");
    }

    if (existingCourse.instructorUuid !== uuid_user) {
        throw new ResponseError(403, "Forbidden: You cannot update this course");
    }

    const updatedCourse = await prismaClient.course.update({
        where: { uuid_course },
        data: {
            ...validatedData,
            updated_at: new Date()
        },
    });

    return updatedCourse;
};

const deleteCourse = async (uuid_user, uuid_course) => {
    const existingCourse = await prismaClient.course.findUnique({
        where: { uuid_course },
    });

    if (!existingCourse) {
        throw new ResponseError(404, "Course not found");
    }

    if (existingCourse.instructorUuid !== uuid_user) {
        throw new ResponseError(403, "Forbidden: You cannot delete this course");
    }

    await prismaClient.course.delete({
        where: { uuid_course },
    });

    return { message: "Course deleted successfully" };
};

export default {
    createCourse,
    getAllCourses,
    getCourseDetail,
    updateCourse,
    deleteCourse
};
