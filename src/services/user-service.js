import { validate } from "../validations/validation.js"
import { loginUserValidation, registerUserValidation, updateUserValidation, getDetailValidateUser, logoutValidate } from "../validations/user-validation.js"
import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email
        }
    })

    if (countUser === 1) {
        throw new ResponseError(400, "Email Sudah Ada")
    }

    user.password = await bcyrpt.hash(user.password, 10)

    return prismaClient.user.create({
        data: user,
        select: {
            name: true,
            email: true,
            role: true
        }
    })
}

const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            email: loginRequest.email
        },
        select: {
            uuid_user: true,
            email: true,
            password: true,
            role: true,
            name: true, 
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username atau Password salah");
    }

    const isPasswordValid = await bcyrpt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username atau Password salah");
    }

    const accessToken = jwt.sign(
        { uuid_user: user.uuid_user, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
    );

    await prismaClient.user.update({
        where: { uuid_user: user.uuid_user },
        data: { token: accessToken }
    });

    return {
        user: {
            name: user.name,
            email: user.email,
            uuid_user: user.uuid_user,
            role: user.role,
            token: accessToken
        }
    };
};

const getUser = async (request) => {
    const users = await prismaClient.user.findMany({
        select: {
            uuid_user: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
            updated_at: true,
        }
    });

    if (!users || users.length === 0) {
        throw new ResponseError(404, "Tidak ada pengguna ditemukan");
    }

    return users;
};

const getDetailUser = async (uuid_user) => {
    const { error } = getDetailValidateUser.validate({ uuid_user });

    if (error) {
        throw new ResponseError(400, error.details[0].message);
    }

    const user = await prismaClient.user.findUnique({
        where: {
            uuid_user: uuid_user,
        },
        select: {
            uuid_user: true,
            email: true,
            name: true,
            role: true,
            created_at: true,
            updated_at: true,
        }
    });

    if (!user) {
        throw new ResponseError(404, "Pengguna tidak ditemukan");
    }

    return user;
};

const updateUser = async (uuid_user, request) => {
    const user = validate(updateUserValidation, request.body);

    const existingUser = await prismaClient.user.findUnique({
        where: { uuid_user: uuid_user },
    });

    if (!existingUser) {
        throw new ResponseError(404, "User tidak ditemukan");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }

    if (user.email) {
        data.email = user.email;
    }

    if (user.role) {
        data.role = user.role;
    }

    if (user.password) {
        data.password = await bcyrpt.hash(user.password, 10);
    }

    data.updated_at = new Date();

    return prismaClient.user.update({
        where: { uuid_user: uuid_user },
        data: data,
    });
};

const deleteUser = async (uuid_user) => {
    const user = await prismaClient.user.findUnique({
        where: {
            uuid_user: uuid_user
        }
    });

    if (!user) {
        throw new ResponseError(404, "User tidak ditemukan");
    }

    await prismaClient.course.deleteMany({
        where: {
            instructorUuid: uuid_user
        }
    });

    await prismaClient.user.delete({
        where: {
            uuid_user: uuid_user
        }
    });

    return { message: "User berhasil dihapus" };
};

const logout = async (uuid_user) => {
    uuid_user = validate(logoutValidate, uuid_user);

    const user = await prismaClient.user.findUnique({
        where: {
            uuid_user: uuid_user
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return prismaClient.user.update({
        where: {
            uuid_user: uuid_user
        },
        data: {
            token: null
        },
        select: {
            email: true
        }
    });
};


export default {
    login,
    register,
    getUser,
    updateUser,
    getDetailUser,
    deleteUser,
    logout
}