import { describe, it, expect, vi } from "vitest";
import { requireAdmin, type AuthRequest } from "./auth.js";
import type { Response } from "express";

describe("requireAdmin middleware", () => {
  it("allows access for admin users", () => {
    const req = { user: { role: "admin" } } as AuthRequest;
    const res = {} as Response;
    const next = vi.fn();

    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("blocks access for non-admin users with 403", () => {
    const req = {
      user: { role: "customer" },
    } as AuthRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn();

    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin role required" });
    expect(next).not.toHaveBeenCalled();
  });
});
