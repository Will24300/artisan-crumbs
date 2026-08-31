import { describe, it, expect, vi } from "vitest";
import { requireAdmin } from "./auth.js";
describe("requireAdmin middleware", () => {
    it("allows access for admin users", () => {
        const req = { user: { role: "admin" } };
        const res = {};
        const next = vi.fn();
        requireAdmin(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    it("blocks access for non-admin users with 403", () => {
        const req = {
            user: { role: "customer" },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        const next = vi.fn();
        requireAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: "Admin role required" });
        expect(next).not.toHaveBeenCalled();
    });
});
