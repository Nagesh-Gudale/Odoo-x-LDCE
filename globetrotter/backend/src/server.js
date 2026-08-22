import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
const app = express();
const PORT = Number.parseInt(process.env["PORT"] ?? "3000", 10);
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            env.FRONTEND_ORIGIN,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Origin", req.headers.origin ?? env.FRONTEND_ORIGIN);
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");
        res.sendStatus(204);
        return;
    }
    next();
});
app.use(express.json());
app.get("/", (_req, res) => {
    res.json({ message: "GlobeTrotter API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes); // mounts /api/ping and /api/me
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map