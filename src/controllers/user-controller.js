import userService from "../services/user-service.js"

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        
        res.cookie("authToken", result.accessToken, {
            httpOnly: true,
        });

        res.status(200).json({
            message: "Login berhasil",
            user: result.user,
        });
    } catch (e) {
        next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        const users = await userService.getUser();

        res.json(users);    
    } catch (e) {
        next(e)
    }
}

const getUserDetail = async (req, res, next) => {
    try {
        const { uuid_user } = req.params; 

        const userDetail = await userService.getDetailUser(uuid_user);

        res.status(200).json({
            data: userDetail
        });
    } catch (e) {
        next(e); 
    }
};

const updateUserDetail = async (req, res, next) => {
    try {
        const { uuid_user } = req.params;
        const userDetail = await userService.updateUser(uuid_user, req);

        res.status(200).json({
            data: userDetail
        });
    } catch (e) {
        next(e);
    }
};

const deleteUserController = async (req, res) => {
    try {
        const { uuid_user } = req.params;

        const result = await userService.deleteUser(uuid_user);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Terjadi kesalahan" });
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const result = await userService.logout(req.body.uuid_user);
        console.log("Logout Success:", result);
        res.status(200).json({
            data: "Sukses Logout"
        });
    } catch (e) {
        next(e);
    }
};


export default {
    login,
    register,
    getUser,
    getUserDetail,
    updateUserDetail,
    logoutUser,
    deleteUserController
}