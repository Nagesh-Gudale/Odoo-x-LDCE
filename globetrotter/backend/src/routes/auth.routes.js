import { Router } from "express";
import { signup, login, verifySignup, verifyLoginOtp, resendOtp, } from "../controllers/auth.controller.js";
const router = Router();
router.post("/signup", signup);
router.post("/verify-signup", verifySignup);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOtp);
export default router;
//# sourceMappingURL=auth.routes.js.map