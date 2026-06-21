class UserService {
    constructor() { }
    getProfile = async (req, res) => {
        return res.status(200).json({
            message: "User profile",
            data: req.user
        });
    };
}
export default new UserService();
