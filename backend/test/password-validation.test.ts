import { describe, it, expect } from "vitest";
import supertest from "supertest";
import app from "../src/app.js";
import { validatePassword } from "../src/utils/passwordValidation.js";

const request = supertest(app);

describe("Password Validation Unit & Integration Tests", () => {
  describe("validatePassword helper", () => {
    it("rejects common weak passwords like 0000, 123456, password, qwerty", () => {
      const weakPasswords = ["0000", "000000", "00000000", "1234", "123456", "12345678", "password", "password123", "qwerty", "11111111"];
      for (const pwd of weakPasswords) {
        const result = validatePassword(pwd);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain("too simple or commonly used");
      }
    });

    it("rejects passwords shorter than 8 characters", () => {
      const result = validatePassword("Abc12");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("at least 8 characters long");
    });

    it("rejects passwords missing uppercase letters", () => {
      const result = validatePassword("artisan123");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("uppercase and lowercase letters");
    });

    it("rejects passwords missing lowercase letters", () => {
      const result = validatePassword("ARTISAN123");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("uppercase and lowercase letters");
    });

    it("rejects passwords missing numbers", () => {
      const result = validatePassword("ArtisanBakery");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("at least one number");
    });

    it("accepts valid strong passwords", () => {
      const validPasswords = ["ArtisanCrumbs2026!", "P@ssw0rdBakery99", "StrongPass123"];
      for (const pwd of validPasswords) {
        const result = validatePassword(pwd);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    });
  });

  describe("API Registration Endpoint Password Rule Enforcement", () => {
    it("blocks registration with weak password '0000'", async () => {
      const res = await request.post("/api/auth/register").send({
        name: "Test User",
        email: "test0000@example.com",
        password: "0000",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error).toMatch(/too simple|commonly used/i);
    });

    it("blocks registration with weak password '123456'", async () => {
      const res = await request.post("/api/auth/register").send({
        name: "Test User",
        email: "test123456@example.com",
        password: "123456",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error).toMatch(/too simple|commonly used/i);
    });
  });
});
