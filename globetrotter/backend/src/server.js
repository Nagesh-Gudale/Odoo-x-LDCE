import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
const app = express();
const PORT = Number.parseInt(process.env["PORT"] ?? "3000", 10);
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