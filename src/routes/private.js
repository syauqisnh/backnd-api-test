import express from "express";
import userController from "../controllers/user-controller.js";
import courseController from "../controllers/course-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import { roleMiddleware } from "../middlewares/role-middleware.js";

const privateRouter = new express.Router()

privateRouter.get("/api/getAll", authMiddleware, roleMiddleware("INSTRUCTOR"), userController.getUser);
privateRouter.get("/api/get-user/:uuid_user", authMiddleware, userController.getUserDetail);
privateRouter.put("/api/update-user/:uuid_user", authMiddleware, userController.updateUserDetail);
privateRouter.delete("/api/logout", authMiddleware, userController.logoutUser);
privateRouter.delete("/api/delete-user/:uuid_user", authMiddleware, roleMiddleware("INSTRUCTOR"), userController.deleteUserController);

privateRouter.post("/api/courses", authMiddleware, roleMiddleware("INSTRUCTOR"), courseController.createCourse);
privateRouter.get("/api/get-courses", authMiddleware, courseController.getAllCourses);
privateRouter.get("/api/get-course/:uuid_course", authMiddleware, courseController.getCourseDetail);  // Get course detail
privateRouter.put("/api/update-course/:uuid_course", authMiddleware, roleMiddleware("INSTRUCTOR"), courseController.updateCourse);  // Update course
privateRouter.delete("/api/delete-course/:uuid_course", authMiddleware, roleMiddleware("INSTRUCTOR"), courseController.deleteCourse);  // Delete course

export {
    privateRouter,
}
