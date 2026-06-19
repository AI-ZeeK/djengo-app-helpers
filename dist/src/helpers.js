"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppHelper = void 0;
var Timeline;
(function (Timeline) {
    Timeline["_1m"] = "1m";
    Timeline["_3m"] = "3m";
    Timeline["_6m"] = "6m";
    Timeline["_1y"] = "1y";
    Timeline["all"] = "all";
})(Timeline || (Timeline = {}));
/** Parse #rgb, #rrggbb, or #rrggbbaa (alpha ignored). */
function parseHexColorRgb(input) {
    if (!input || typeof input !== "string")
        return null;
    let h = input.trim();
    if (!h.startsWith("#"))
        return null;
    h = h.slice(1);
    if (h.length === 3 || h.length === 4) {
        h = h
            .slice(0, 3)
            .split("")
            .map((c) => c + c)
            .join("");
    }
    if (h.length === 6 && /^[\dA-Fa-f]{6}$/.test(h)) {
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    }
    if (h.length === 8 && /^[\dA-Fa-f]{8}$/.test(h)) {
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
        };
    }
    return null;
}
function mixRgb(a, b, t) {
    const u = Math.max(0, Math.min(1, t));
    return {
        r: Math.round(a.r + (b.r - a.r) * u),
        g: Math.round(a.g + (b.g - a.g) * u),
        b: Math.round(a.b + (b.b - a.b) * u),
    };
}
function rgbToHex6(rgb) {
    return ("#" +
        [rgb.r, rgb.g, rgb.b]
            .map((x) => Math.max(0, Math.min(255, Math.round(x)))
            .toString(16)
            .padStart(2, "0"))
            .join(""));
}
class AppHelper {
    static relativeLuminanceChannel(c) {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    /** WCAG 2.x relative luminance (0–1). */
    static relativeLuminance(rgb) {
        const R = AppHelper.relativeLuminanceChannel(rgb.r);
        const G = AppHelper.relativeLuminanceChannel(rgb.g);
        const B = AppHelper.relativeLuminanceChannel(rgb.b);
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
    static wcagContrastRatio(lumA, lumB) {
        const L1 = Math.max(lumA, lumB);
        const L2 = Math.min(lumA, lumB);
        return (L1 + 0.05) / (L2 + 0.05);
    }
    /**
     * Best-effort readable foreground (hex) for text/icons on a solid background.
     * Uses WCAG luminance for hex colors; falls back to `isDarkColor` for tailwind-style strings.
     * `isDark` nudges light-mode-on-dark-UI toward slightly softer highlights when contrast is tied.
     */
    static contrastingForegroundForBackground(cssColor, opts) {
        const isDark = opts?.isDark === true;
        const fromHex = parseHexColorRgb(cssColor);
        if (fromHex) {
            const bgL = AppHelper.relativeLuminance(fromHex);
            const darkFg = { r: 17, g: 24, b: 39 };
            const crDark = AppHelper.wcagContrastRatio(bgL, AppHelper.relativeLuminance(darkFg));
            const lightCandidates = isDark
                ? [
                    { r: 252, g: 252, b: 252 },
                    { r: 241, g: 245, b: 249 },
                    { r: 226, g: 232, b: 240 },
                ]
                : [{ r: 253, g: 253, b: 253 }];
            let bestLight = lightCandidates[0];
            let bestCrLight = AppHelper.wcagContrastRatio(bgL, AppHelper.relativeLuminance(bestLight));
            for (let i = 1; i < lightCandidates.length; i++) {
                const c = lightCandidates[i];
                const cr = AppHelper.wcagContrastRatio(bgL, AppHelper.relativeLuminance(c));
                if (cr > bestCrLight) {
                    bestCrLight = cr;
                    bestLight = c;
                }
            }
            return bestCrLight >= crDark ? rgbToHex6(bestLight) : "#111827";
        }
        if (!cssColor)
            return "#111827";
        return AppHelper.isDarkColor(cssColor) ? "#fafafa" : "#111827";
    }
    /**
     * Card / legend chrome from one accent color (saved on the server) plus light/dark page context.
     */
    static roleLevelUiFromAccent(accentCss, isDark) {
        const fallback = isDark
            ? { r: 71, g: 85, b: 105 }
            : { r: 148, g: 163, b: 184 };
        const accent = parseHexColorRgb(accentCss) ?? fallback;
        const page = isDark ? { r: 15, g: 23, b: 42 } : { r: 248, g: 250, b: 252 };
        const surface = mixRgb(page, accent, isDark ? 0.26 : 0.13);
        const border = mixRgb(accent, isDark ? { r: 255, g: 255, b: 255 } : { r: 15, g: 23, b: 42 }, isDark ? 0.34 : 0.2);
        const ring = `rgba(${accent.r},${accent.g},${accent.b},${isDark ? 0.34 : 0.25})`;
        const badgeBg = mixRgb(accent, isDark ? { r: 8, g: 12, b: 22 } : { r: 255, g: 255, b: 255 }, isDark ? 0.42 : 0.14);
        const badgeHex = rgbToHex6(badgeBg);
        const surfaceHex = rgbToHex6(surface);
        const badgeText = AppHelper.contrastingForegroundForBackground(badgeHex, {
            isDark,
        });
        const titleText = AppHelper.contrastingForegroundForBackground(surfaceHex, {
            isDark,
        });
        const mutedText = isDark ? "#94a3b8" : "#64748b";
        return {
            surface: surfaceHex,
            border: rgbToHex6(border),
            ring,
            dot: rgbToHex6(accent),
            badgeBg: badgeHex,
            badgeText,
            titleText,
            mutedText,
        };
    }
    /**
     * Generates a random OTP (One-Time Password)
     * @param options Configuration options for OTP generation
     * @returns Generated OTP string
     */
    static generateOTP({ length = 6, options = {
        numbers: true,
        uppercase: false,
        lowercase: false,
    }, }) {
        const { numbers, uppercase, lowercase } = options;
        let characters = "";
        if (numbers)
            characters += "0123456789";
        if (uppercase)
            characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (lowercase)
            characters += "abcdefghijklmnopqrstuvwxyz";
        if (!characters) {
            throw new Error("At least one character type must be enabled.");
        }
        let otp = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            otp += characters[randomIndex];
        }
        return otp;
    }
    /**
     * Generates a future timestamp based on the given number of seconds
     * @param seconds Number of seconds to add to current time
     * @returns Future Date object
     */
    static getFutureTimestamp({ seconds }) {
        const now = new Date();
        return new Date(now.getTime() + seconds * 1000);
    }
    /**
     * Generates a unique value with a prefix
     * @param value Base value to generate unique identifier from
     * @returns Unique string with prefix
     */
    static generateUniqueValue(value) {
        const prefix = value.slice(0, 3).toUpperCase();
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}-${timestamp}-${random}`;
    }
    /**
     * Canonical email storage: trim + lowercase (login, uniqueness, lookups).
     */
    static normalizeEmail(value) {
        const trimmed = (value ?? "").trim();
        return trimmed ? trimmed.toLowerCase() : null;
    }
    static normalizeEmailOrEmpty(value) {
        return AppHelper.normalizeEmail(value) ?? "";
    }
    /** Prisma / audit payloads — undefined instead of null when empty. */
    static normalizeEmailOptional(value) {
        return AppHelper.normalizeEmail(value) ?? undefined;
    }
    /**
     * Canonical title/name storage: company, branch, department, role,
     * staff, partner, and other entity display names.
     */
    static normalizeStoredName(value) {
        const trimmed = (value ?? "").trim();
        return trimmed ? trimmed.toLowerCase() : null;
    }
    static normalizeStoredNameOrEmpty(value) {
        return AppHelper.normalizeStoredName(value) ?? "";
    }
    /** Prisma updates — undefined instead of null when empty. */
    static normalizeStoredNameOptional(value) {
        return AppHelper.normalizeStoredName(value) ?? undefined;
    }
    /** Free-text fields (descriptions, notes) — trim only, preserve casing. */
    static normalizeStoredText(value) {
        const trimmed = (value ?? "").trim();
        return trimmed || null;
    }
    /** Prisma updates — undefined instead of null when empty. */
    static normalizeStoredTextOptional(value) {
        return AppHelper.normalizeStoredText(value) ?? undefined;
    }
    /**
     * Validates an email address format
     * @param email Email address to validate
     * @returns boolean indicating if email is valid
     */
    static isValidEmail(email) {
        const normalized = AppHelper.normalizeEmail(email);
        if (!normalized)
            return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(normalized);
    }
    static isPlausibleEmail(email) {
        return AppHelper.isValidEmail(email);
    }
    static emailsMatch(a, b) {
        const na = AppHelper.normalizeEmail(a);
        const nb = AppHelper.normalizeEmail(b);
        if (!na || !nb)
            return false;
        return na === nb;
    }
    /**
     * Formats a phone number to a standard format
     * @param phone Phone number to format
     * @returns Formatted phone number
     */
    static formatPhoneNumber(phone) {
        // Remove all non-numeric characters
        const cleaned = phone.replace(/\D/g, "");
        // Format based on length
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        }
        else if (cleaned.length === 11 && cleaned.startsWith("1")) {
            return `+${cleaned}`;
        }
        return `+${cleaned}`;
    }
    /**
     * Generates a random password with specified requirements
     * @param length Length of the password
     * @returns Generated password
     */
    static generatePassword(length = 12) {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const allChars = uppercase + lowercase + numbers + symbols;
        let password = "";
        // Ensure at least one of each type
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        // Shuffle the password
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }
    /**
     * Sanitizes a string by removing potentially harmful characters
     * @param input String to sanitize
     * @returns Sanitized string
     */
    static sanitizeString(input) {
        return input
            .replace(/[<>]/g, "") // Remove < and >
            .replace(/javascript:/gi, "") // Remove javascript: protocol
            .replace(/on\w+=/gi, "") // Remove on* attributes
            .trim();
    }
    /**
     * Checks if an object is empty. If so, returns null; otherwise, returns the object
     */
    static isEmptyOrNull(obj) {
        if (obj &&
            typeof obj === "object" &&
            !Array.isArray(obj) &&
            Object.keys(obj).length === 0) {
            return null;
        }
        return obj;
    }
    /**
     * Converts object keys to snake_case recursively, and converts empty objects to null.
     */
    static toSnakeCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(AppHelper.toSnakeCase);
        }
        else if (obj !== null && typeof obj === "object") {
            const converted = Object.fromEntries(Object.entries(obj).map(([k, v]) => [
                k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
                AppHelper.toSnakeCase(v),
            ]));
            return AppHelper.isEmptyOrNull(converted);
        }
        return obj;
    }
    /**
     * Converts object keys to camelCase recursively, and converts empty objects to null.
     */
    static toCamelCase(obj) {
        if (Array.isArray(obj)) {
            return obj.map(AppHelper.toCamelCase);
        }
        else if (obj !== null && typeof obj === "object") {
            const converted = Object.fromEntries(Object.entries(obj).map(([k, v]) => [
                k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
                AppHelper.toCamelCase(v),
            ]));
            return AppHelper.isEmptyOrNull(converted);
        }
        return obj;
    }
    /**
     * Generates a unique company reference ID with hyphens.
     * Format: XX-CCCCCCss-YY
     * - XX: first 2 letters of company name (uppercase, sanitized)
     * - CCCCCC: 6 random uppercase alphanumeric
     * - ss: 2 random lowercase letters
     * - YY: last 2 digits of current year
     */
    static generateReferenceId({ company_name, }) {
        const namePart = company_name
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase()
            .slice(0, 2)
            .padEnd(2, "X");
        const now = new Date();
        const yearPart = now.getFullYear().toString().slice(-2);
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        let randomUpper = "";
        for (let i = 0; i < 6; i++) {
            randomUpper += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
        }
        let randomLower = "";
        for (let i = 0; i < 2; i++) {
            randomLower += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
        }
        return `${namePart}-${randomUpper}${randomLower}-${yearPart}`;
    }
    static generateUserSlug() {
        // Generate 3 random uppercase letters
        const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
        // Generate 4 random digits
        const digits = Math.floor(1000 + Math.random() * 9000).toString();
        // Get current date and encode as 4 uppercase letters (e.g., Dec 16, 2025 -> D16Z)
        // We'll use: 1st letter of month, 2-digit day, last char of year (base36)
        const now = new Date();
        const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
        const monthLetter = months[now.getMonth()];
        const day = now.getDate().toString().padStart(2, "0");
        const yearChar = now.getFullYear().toString(36).toUpperCase().slice(-1); // base36 for variety
        const datestamp = `${monthLetter}${day}${yearChar}`;
        return `${letters}-${digits}-${datestamp}`;
    }
    static sanitizeUser(user, extraFields = []) {
        if (!user)
            return user;
        const sensitiveFields = ["password", "refresh_token", ...extraFields];
        const sanitized = { ...user };
        for (const field of sensitiveFields) {
            if (field in sanitized) {
                sanitized[field] = undefined;
            }
        }
        // Always stringify date fields if present
        const dateFields = ["created_at", "last_login", "updated_at"];
        for (const field of dateFields) {
            if (field in sanitized && sanitized[field] != null) {
                if (typeof sanitized[field] !== "string") {
                    sanitized[field] = String(sanitized[field]);
                }
            }
        }
        return sanitized;
    }
    static computeTrend(current, previous) {
        if (previous === 0 && current > 0)
            return { percentage: 100, trend: "neutral" };
        if (previous === 0 && current === 0)
            return { percentage: 0, trend: "neutral" };
        const diff = current - previous;
        const pct = previous !== 0 ? (diff / previous) * 100 : 0;
        let trend = "neutral";
        if (pct > 0)
            trend = "increase";
        else if (pct < 0)
            trend = "decrease";
        else if (pct === 0)
            trend = "neutral";
        return { percentage: Math.round(pct * 10) / 10, trend };
    }
    static getDateRanges({ timeline, start_date, end_date, }) {
        const now = new Date();
        let date_from;
        let date_to;
        let prev_date_from;
        let prev_date_to;
        if (timeline) {
            switch (timeline) {
                case Timeline._1m:
                    date_from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    prev_date_from = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                    prev_date_to = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case Timeline._3m:
                    date_from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    prev_date_from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    prev_date_to = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    break;
                case Timeline._6m:
                    date_from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    prev_date_from = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
                    prev_date_to = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    break;
                case Timeline._1y:
                    date_from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    prev_date_from = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
                    prev_date_to = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
            }
            date_to = now;
        }
        if (start_date)
            date_from = new Date(start_date);
        if (end_date)
            date_to = new Date(end_date);
        if (start_date && end_date) {
            const diff = new Date(end_date).getTime() - new Date(start_date).getTime();
            prev_date_to = new Date(new Date(start_date).getTime());
            prev_date_from = new Date(new Date(start_date).getTime() - diff);
        }
        return { date_from, date_to, prev_date_from, prev_date_to };
    }
    static buildWhere(extra = {}, dateRange) {
        const where = { ...extra };
        const { date_from, date_to, prev_date_from, prev_date_to, usePrev } = dateRange;
        const from = usePrev ? prev_date_from : date_from;
        const to = usePrev ? prev_date_to : date_to;
        if (from || to) {
            where.created_at = {};
            if (from)
                where.created_at.gte = from;
            if (to)
                where.created_at.lte = to;
        }
        return where;
    }
    static determineFileType(mimetype) {
        if (mimetype.startsWith("image/"))
            return "image";
        if (mimetype.startsWith("video/"))
            return "video";
        if (mimetype.startsWith("audio/"))
            return "audio";
        // Common document MIME types
        const documentTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "application/rtf",
            "application/vnd.oasis.opendocument.text",
            "application/vnd.oasis.opendocument.spreadsheet",
            "application/vnd.oasis.opendocument.presentation",
        ];
        if (documentTypes.includes(mimetype))
            return "document";
        throw new Error("Unsupported file type");
    }
    /**
     * Helper function to build query URLs by replacing placeholders with actual values
     * @param template - URL template with placeholders (e.g., "path/:id?param=:value")
     * @param params - Object containing parameter values to substitute
     * @returns Formatted URL with placeholders replaced
     */
    static buildQueryUrl(template, params) {
        let result = template;
        // Then replace all other parameters
        for (const [key, value] of Object.entries(params)) {
            const placeholder = `:${key}`;
            let stringValue;
            if (Array.isArray(value)) {
                stringValue = value.map(String).join(",");
            }
            else {
                stringValue = String(value);
            }
            result = result.replace(new RegExp(placeholder, "g"), stringValue);
        }
        // Clean up any remaining placeholders (like :param) that weren't replaced
        // This handles cases where parameters are missing or empty
        result = result.replace(/:[^\/&\?]+/g, "");
        return result;
    }
}
exports.AppHelper = AppHelper;
AppHelper.algorithm = "aes-256-cbc";
AppHelper.isDarkColor = (color) => {
    if (!color)
        return false;
    // If color is a gradient (contains from-, via-, or to-), extract all stops
    if (/from-|via-|to-/.test(color)) {
        // Extract all color stops
        const stops = [];
        const fromMatch = color.match(/from-([a-zA-Z0-9-]+)/);
        const viaMatch = color.match(/via-([a-zA-Z0-9-]+)/);
        const toMatch = color.match(/to-([a-zA-Z0-9-]+)/);
        if (fromMatch)
            stops.push(fromMatch[1]);
        if (viaMatch)
            stops.push(viaMatch[1]);
        if (toMatch)
            stops.push(toMatch[1]);
        // If no stops found, fallback to original logic
        if (stops.length === 0)
            return false;
        // Compute brightness for each stop
        let darkCount = 0;
        let total = 0;
        for (const stop of stops) {
            if (AppHelper.isDarkColor(stop))
                darkCount++;
            total++;
        }
        // If majority of stops are dark, treat as dark
        return darkCount / total >= 0.5;
    }
    // Tailwind color mapping to hex values
    const tailwindColors = {
        // Slate
        "slate-50": "#f8fafc",
        "slate-100": "#f1f5f9",
        "slate-200": "#e2e8f0",
        "slate-300": "#cbd5e1",
        "slate-400": "#94a3b8",
        "slate-500": "#64748b",
        "slate-600": "#475569",
        "slate-700": "#334155",
        "slate-800": "#1e293b",
        "slate-900": "#0f172a",
        "slate-950": "#020617",
        // Gray
        "gray-50": "#f9fafb",
        "gray-100": "#f3f4f6",
        "gray-200": "#e5e7eb",
        "gray-300": "#d1d5db",
        "gray-400": "#9ca3af",
        "gray-500": "#6b7280",
        "gray-600": "#4b5563",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "gray-900": "#111827",
        "gray-950": "#030712",
        // Red
        "red-50": "#fef2f2",
        "red-100": "#fee2e2",
        "red-200": "#fecaca",
        "red-300": "#fca5a5",
        "red-400": "#f87171",
        "red-500": "#ef4444",
        "red-600": "#dc2626",
        "red-700": "#b91c1c",
        "red-800": "#991b1b",
        "red-900": "#7f1d1d",
        "red-950": "#450a0a",
        // Blue
        "blue-50": "#eff6ff",
        "blue-100": "#dbeafe",
        "blue-200": "#bfdbfe",
        "blue-300": "#93c5fd",
        "blue-400": "#60a5fa",
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
        "blue-700": "#1d4ed8",
        "blue-800": "#1e40af",
        "blue-900": "#1e3a8a",
        "blue-950": "#172554",
        // Green
        "green-50": "#f0fdf4",
        "green-100": "#dcfce7",
        "green-200": "#bbf7d0",
        "green-300": "#86efac",
        "green-400": "#4ade80",
        "green-500": "#22c55e",
        "green-600": "#16a34a",
        "green-700": "#15803d",
        "green-800": "#166534",
        "green-900": "#14532d",
        "green-950": "#052e16",
        // Yellow
        "yellow-50": "#fefce8",
        "yellow-100": "#fef3c7",
        "yellow-200": "#fed7aa",
        "yellow-300": "#fcd34d",
        "yellow-400": "#fbbf24",
        "yellow-500": "#f59e0b",
        "yellow-600": "#d97706",
        "yellow-700": "#b45309",
        "yellow-800": "#92400e",
        "yellow-900": "#78350f",
        "yellow-950": "#451a03",
        // Purple
        "purple-50": "#faf5ff",
        "purple-100": "#f3e8ff",
        "purple-200": "#e9d5ff",
        "purple-300": "#d8b4fe",
        "purple-400": "#c084fc",
        "purple-500": "#a855f7",
        "purple-600": "#9333ea",
        "purple-700": "#7c3aed",
        "purple-800": "#6b21a8",
        "purple-900": "#581c87",
        "purple-950": "#3b0764",
        // Pink
        "pink-50": "#fdf2f8",
        "pink-100": "#fce7f3",
        "pink-200": "#fbcfe8",
        "pink-300": "#f9a8d4",
        "pink-400": "#f472b6",
        "pink-500": "#ec4899",
        "pink-600": "#db2777",
        "pink-700": "#be185d",
        "pink-800": "#9d174d",
        "pink-900": "#831843",
        "pink-950": "#500724",
        // Indigo
        "indigo-50": "#eef2ff",
        "indigo-100": "#e0e7ff",
        "indigo-200": "#c7d2fe",
        "indigo-300": "#a5b4fc",
        "indigo-400": "#818cf8",
        "indigo-500": "#6366f1",
        "indigo-600": "#4f46e5",
        "indigo-700": "#4338ca",
        "indigo-800": "#3730a3",
        "indigo-900": "#312e81",
        "indigo-950": "#1e1b4b",
        // Cyan
        "cyan-50": "#ecfeff",
        "cyan-100": "#cffafe",
        "cyan-200": "#a5f3fc",
        "cyan-300": "#67e8f9",
        "cyan-400": "#22d3ee",
        "cyan-500": "#06b6d4",
        "cyan-600": "#0891b2",
        "cyan-700": "#0e7490",
        "cyan-800": "#155e75",
        "cyan-900": "#164e63",
        "cyan-950": "#083344",
        // Teal
        "teal-50": "#f0fdfa",
        "teal-100": "#ccfbf1",
        "teal-200": "#99f6e4",
        "teal-300": "#5eead4",
        "teal-400": "#2dd4bf",
        "teal-500": "#14b8a6",
        "teal-600": "#0d9488",
        "teal-700": "#0f766e",
        "teal-800": "#115e59",
        "teal-900": "#134e4a",
        "teal-950": "#042f2e",
        // Emerald
        "emerald-50": "#ecfdf5",
        "emerald-100": "#d1fae5",
        "emerald-200": "#a7f3d0",
        "emerald-300": "#6ee7b7",
        "emerald-400": "#34d399",
        "emerald-500": "#10b981",
        "emerald-600": "#059669",
        "emerald-700": "#047857",
        "emerald-800": "#065f46",
        "emerald-900": "#064e3b",
        "emerald-950": "#022c22",
        // Orange
        "orange-50": "#fff7ed",
        "orange-100": "#ffedd5",
        "orange-200": "#fed7aa",
        "orange-300": "#fdba74",
        "orange-400": "#fb923c",
        "orange-500": "#f97316",
        "orange-600": "#ea580c",
        "orange-700": "#c2410c",
        "orange-800": "#9a3412",
        "orange-900": "#7c2d12",
        "orange-950": "#431407",
        // Black and White
        black: "#000000",
        white: "#ffffff",
    };
    let hexColor;
    // Check if it's a Tailwind color class
    if (color.includes("-")) {
        // Extract color from Tailwind class (e.g., "bg-blue-500" -> "blue-500")
        const colorMatch = color.match(/(?:bg-|text-|border-)?([a-z]+-?\d+|black|white)/);
        if (colorMatch) {
            const tailwindColor = colorMatch[1];
            hexColor = tailwindColors[tailwindColor];
            if (!hexColor)
                return false; // Unknown Tailwind color
        }
        else {
            return false;
        }
    }
    else if (color.startsWith("#")) {
        // It's already a hex color
        hexColor = color;
    }
    else if (tailwindColors[color]) {
        // It's a direct Tailwind color name
        hexColor = tailwindColors[color];
    }
    else {
        return false; // Unknown color format
    }
    // Convert hex to RGB
    const hex = hexColor.replace("#", "");
    if (hex.length !== 6)
        return false;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate brightness using the formula: (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return true if the color is dark (brightness < 0.5)
    return brightness < 0.5;
};
AppHelper.camelToWords = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
};
AppHelper.getDatePart = (datetime) => {
    if (!datetime || !datetime.includes("T")) {
        return datetime;
    }
    return datetime.split("T")[0];
};
//# sourceMappingURL=helpers.js.map