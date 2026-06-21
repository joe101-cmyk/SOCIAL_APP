import { Badrequestextiption, Notfound } from "../../utils/response/error.js";
import { UserRepository } from "../../DB/repositry/user.repo.js";
import { User } from "../../DB/models/user.model.js";
import { comapareHash, generateHash } from "../../utils/security/Hash.js";
import { TokenService } from "../../utils/Token/Token.js";
import { RoleEnum, Logout } from "../../utils/enum/auth.enum.js";
class authsercice {
    _tokenservice;
    _usermodel = new UserRepository(User);
    constructor() {
        this._tokenservice = new TokenService();
    }
    signup = async (req, res) => {
        const { username, email, password, firstname, lastname } = req.body;
        const Hash_Password = await generateHash(password);
        const check_user = await this._usermodel.findOne({
            filter: { email },
            select: "email"
        });
        if (check_user) {
            throw new Badrequestextiption("This User Exist");
        }
        const user = await this._usermodel.create({
            data: {
                username,
                email,
                password: Hash_Password,
                firstname,
                lastname,
                role: RoleEnum.USER
            }
        });
        return res.status(201).json({
            message: "Signup successful",
            data: {
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role
            }
        });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this._usermodel.findOne({
            filter: { email }
        });
        if (!user) {
            throw new Notfound("User not Found");
        }
        const isvalidpassword = await comapareHash(password, user.password);
        if (!isvalidpassword) {
            throw new Badrequestextiption("Invalid Password");
        }
        const credentials = await this._tokenservice.getNewLoginCredentials({
            id: user._id.toString(),
            role: user.role
        });
        return res.status(200).json({
            message: "Login successful",
            accesstoken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            data: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    };
    logout = async (req, res) => {
        const { flag } = req.body;
        let status = 200;
        switch (flag) {
            case Logout.LOGOUT:
                status = 200;
                break;
            default:
                status = 400;
                break;
        }
        return res.status(status).json({
            message: "Logout with Redis successful",
            flag
        });
    };
}
export default new authsercice();
