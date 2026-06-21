import { Router } from "express";
import authService from "./auth.service.js";
import { validateRequest } from "../../middleware/validation.middleware.js";
import { Signupschema } from "./auth.validation.js";

const router: Router = Router();

router.post(
    "/signup",
    validateRequest(Signupschema),
    authService.signup
);

router.post("/login", authService.login);
router.post("/logout", authService.logout);

export default router;