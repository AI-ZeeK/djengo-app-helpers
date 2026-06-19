type ExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}` ? Param | ExtractRouteParams<`/${Rest}`> : T extends `${string}:${infer Param}&${infer Rest}` ? Param | ExtractRouteParams<`&${Rest}`> : T extends `${string}:${infer Param}?${infer Rest}` ? Param | ExtractRouteParams<`?${Rest}`> : T extends `${string}:${infer Param}` ? Param : never;
type RouteParams<T extends string> = {
    [K in ExtractRouteParams<T>]: string | number | (string | number)[];
};
/** UI tokens derived from a single server-saved accent (role level color) + theme. */
export type RoleLevelUiChrome = {
    surface: string;
    border: string;
    ring: string;
    dot: string;
    badgeBg: string;
    badgeText: string;
    titleText: string;
    mutedText: string;
};
export declare class AppHelper {
    private static algorithm;
    static isDarkColor: (color: string | undefined) => boolean;
    private static relativeLuminanceChannel;
    /** WCAG 2.x relative luminance (0–1). */
    static relativeLuminance(rgb: {
        r: number;
        g: number;
        b: number;
    }): number;
    static wcagContrastRatio(lumA: number, lumB: number): number;
    /**
     * Best-effort readable foreground (hex) for text/icons on a solid background.
     * Uses WCAG luminance for hex colors; falls back to `isDarkColor` for tailwind-style strings.
     * `isDark` nudges light-mode-on-dark-UI toward slightly softer highlights when contrast is tied.
     */
    static contrastingForegroundForBackground(cssColor: string | undefined, opts?: {
        isDark?: boolean;
    }): string;
    /**
     * Card / legend chrome from one accent color (saved on the server) plus light/dark page context.
     */
    static roleLevelUiFromAccent(accentCss: string | undefined, isDark: boolean): RoleLevelUiChrome;
    static camelToWords: (str: string) => string;
    static getDatePart: (datetime: string) => string;
    /**
     * Generates a random OTP (One-Time Password)
     * @param options Configuration options for OTP generation
     * @returns Generated OTP string
     */
    static generateOTP({ length, options, }: {
        length?: number;
        options?: {
            numbers?: boolean;
            uppercase?: boolean;
            lowercase?: boolean;
        };
    }): string;
    /**
     * Generates a future timestamp based on the given number of seconds
     * @param seconds Number of seconds to add to current time
     * @returns Future Date object
     */
    static getFutureTimestamp({ seconds }: {
        seconds: number;
    }): Date;
    /**
     * Generates a unique value with a prefix
     * @param value Base value to generate unique identifier from
     * @returns Unique string with prefix
     */
    static generateUniqueValue(value: string): string;
    /**
     * Canonical email storage: trim + lowercase (login, uniqueness, lookups).
     */
    static normalizeEmail(value?: string | null): string | null;
    static normalizeEmailOrEmpty(value?: string | null): string;
    /** Prisma / audit payloads — undefined instead of null when empty. */
    static normalizeEmailOptional(value?: string | null): string | undefined;
    /**
     * Canonical title/name storage: company, branch, department, role,
     * staff, partner, and other entity display names.
     */
    static normalizeStoredName(value?: string | null): string | null;
    static normalizeStoredNameOrEmpty(value?: string | null): string;
    /** Prisma updates — undefined instead of null when empty. */
    static normalizeStoredNameOptional(value?: string | null): string | undefined;
    /** Free-text fields (descriptions, notes) — trim only, preserve casing. */
    static normalizeStoredText(value?: string | null): string | null;
    /**
     * Validates an email address format
     * @param email Email address to validate
     * @returns boolean indicating if email is valid
     */
    static isValidEmail(email: string): boolean;
    static isPlausibleEmail(email: string): boolean;
    static emailsMatch(a: string, b: string): boolean;
    /**
     * Formats a phone number to a standard format
     * @param phone Phone number to format
     * @returns Formatted phone number
     */
    static formatPhoneNumber(phone: string): string;
    /**
     * Generates a random password with specified requirements
     * @param length Length of the password
     * @returns Generated password
     */
    static generatePassword(length?: number): string;
    /**
     * Sanitizes a string by removing potentially harmful characters
     * @param input String to sanitize
     * @returns Sanitized string
     */
    static sanitizeString(input: string): string;
    /**
     * Checks if an object is empty. If so, returns null; otherwise, returns the object
     */
    static isEmptyOrNull<T extends object>(obj: T): T | null;
    /**
     * Converts object keys to snake_case recursively, and converts empty objects to null.
     */
    static toSnakeCase(obj: any): any;
    /**
     * Converts object keys to camelCase recursively, and converts empty objects to null.
     */
    static toCamelCase(obj: any): any;
    /**
     * Generates a unique company reference ID with hyphens.
     * Format: XX-CCCCCCss-YY
     * - XX: first 2 letters of company name (uppercase, sanitized)
     * - CCCCCC: 6 random uppercase alphanumeric
     * - ss: 2 random lowercase letters
     * - YY: last 2 digits of current year
     */
    static generateReferenceId({ company_name, }: {
        company_name: string;
    }): string;
    static generateUserSlug(): string;
    static sanitizeUser<T extends object>(user: T, extraFields?: string[]): Partial<T>;
    static computeTrend(current: number, previous: number): {
        percentage: number;
        trend: "increase" | "decrease" | "neutral";
    };
    static getDateRanges({ timeline, start_date, end_date, }: {
        timeline: string;
        start_date?: string;
        end_date?: string;
    }): {
        date_from?: Date;
        date_to?: Date;
        prev_date_from?: Date;
        prev_date_to?: Date;
    };
    static buildWhere(extra: any | undefined, dateRange: any): any;
    static determineFileType(mimetype: string): "image" | "audio" | "video" | "document";
    /**
     * Helper function to build query URLs by replacing placeholders with actual values
     * @param template - URL template with placeholders (e.g., "path/:id?param=:value")
     * @param params - Object containing parameter values to substitute
     * @returns Formatted URL with placeholders replaced
     */
    static buildQueryUrl<T extends string>(template: T, params: RouteParams<T>): string;
}
export {};
//# sourceMappingURL=helpers.d.ts.map