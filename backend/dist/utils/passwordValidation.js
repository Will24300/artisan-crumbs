/**
 * Password validation utilities for Artisan Crumbs
 */
const COMMON_WEAK_PASSWORDS = new Set([
    "0000",
    "00000",
    "000000",
    "0000000",
    "00000000",
    "1234",
    "12345",
    "123456",
    "1234567",
    "12345678",
    "123456789",
    "1234567890",
    "111111",
    "11111111",
    "987654",
    "987654321",
    "password",
    "password123",
    "pass1234",
    "admin",
    "admin123",
    "qwerty",
    "qwertyuiop",
    "letmein",
    "welcome",
    "123123",
    "abc123",
    "iloveyou",
    "master",
    "monkey",
    "dragon",
]);
export function validatePassword(password) {
    const pwd = password || "";
    const lowerPwd = pwd.toLowerCase();
    const minLength = pwd.length >= 8;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    // Check if it's a known common weak password or repeating pattern
    const isRepeatingChar = pwd.length > 0 && /^(.)\1+$/.test(pwd);
    const isListedWeak = COMMON_WEAK_PASSWORDS.has(lowerPwd);
    // Check sequential numerical patterns (like 12345678 or 87654321)
    const isSequentialNumbers = /^0123456789|123456789|23456789|987654321|87654321$/.test(lowerPwd);
    const notCommon = !isListedWeak && !isRepeatingChar && !isSequentialNumbers;
    const checks = {
        minLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        notCommon,
    };
    let score = 0;
    if (minLength)
        score += 1;
    if (hasUppercase && hasLowercase)
        score += 1;
    if (hasNumber)
        score += 1;
    if (notCommon && pwd.length >= 10)
        score += 1;
    if (!notCommon) {
        return {
            isValid: false,
            error: "This password is too simple or commonly used (e.g. '0000' or '123456'). Please choose a stronger password.",
            score: 0,
            checks,
        };
    }
    if (!minLength) {
        return {
            isValid: false,
            error: "Password must be at least 8 characters long.",
            score,
            checks,
        };
    }
    if (!hasLowercase || !hasUppercase) {
        return {
            isValid: false,
            error: "Password must include both uppercase and lowercase letters.",
            score,
            checks,
        };
    }
    if (!hasNumber) {
        return {
            isValid: false,
            error: "Password must include at least one number.",
            score,
            checks,
        };
    }
    return {
        isValid: true,
        score: Math.max(score, 3),
        checks,
    };
}
