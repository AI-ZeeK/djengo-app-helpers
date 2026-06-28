export type PhoneInputParts = {
    dialCode: string;
    phoneNumber: string;
};
export type SplitCandidate = {
    dialCode: string;
    nationalDigits: string;
    score: number;
};
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
    /** Prisma updates — undefined instead of null when empty. */
    static normalizeStoredTextOptional(value?: string | null): string | undefined;
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
    /** Max digits in the calling-code field (+ prefix is UI only). */
    static DIAL_CODE_MAX_LENGTH: number;
    /** Debounce before auto-splitting a combined number across dial + national fields. */
    static PHONE_AUTO_SPLIT_DEBOUNCE_MS: number;
    /** Default debounce before phone availability lookup API call. */
    static PHONE_VALIDATION_DEBOUNCE_MS: number;
    /** Minimum total digits before attempting an auto-split while typing. */
    static PHONE_AUTO_SPLIT_MIN_DIGITS: number;
    /**
     * ITU-T E.164 country calling codes (digits only).
     * Used to auto-advance once the prefix is unambiguous (e.g. 44 → UK, 254 → KE).
     */
    static CALLING_CODES: Set<string>;
    static clampDialCodeInput(value: string): string;
    /** True when focus should move to the national number field. */
    static shouldAdvanceFromDialCode(digits: string): boolean;
    static stripInternationalPrefix(digits: string): string;
    /** Typical national subscriber lengths for common calling codes (ITU). */
    static PREFERRED_NATIONAL_LENGTHS: Record<string, number[]>;
    static scorePhoneSplit(dialCode: string, national: string, totalDigits: number, dialHint?: string): number;
    static collectCallingCodeSplits(rawDigits: string, dialHint?: string): SplitCandidate[];
    static pickBestCallingCodeSplit(rawDigits: string, dialHint?: string): {
        dialCode: string;
        nationalDigits: string;
    } | null;
    /**
     * Best calling-code split using national length + dial-code specificity scoring.
     */
    static splitLeadingCallingCode(rawDigits: string, dialHint?: string): {
        dialCode: string;
        nationalDigits: string;
    } | null;
    /**
     * When paste/autofill or typing lands a full number in the national field (or split
     * across both fields), derive dial + national parts without disturbing valid input.
     */
    static tryAutoSplitPhoneInput(dialCode: string, phoneNumber: string): PhoneInputParts | null;
    /** Parse clipboard/autofill text into dial + national when possible. */
    static parsePhoneClipboardText(text: string, dialHint?: string): PhoneInputParts | null;
    /** Digits only. */
    static phoneDigits(value: string): string;
    /** Calling code digits (no +), e.g. 254. */
    static normalizeDialCode(code: string): string;
    /** National subscriber number — strips leading 0 and embedded dial prefix. */
    static normalizeNationalNumber(phoneNumber: string, dialCode?: string): string;
    static parsePhoneParts(dialCode: string, phoneNumber: string): {
        dial: string;
        national: string;
    };
    static isPlausibleNationalNumber(national: string): boolean;
    static phonesMatch(dialA: string, nationalA: string, dialB: string, nationalB: string): boolean;
    /** Parse legacy stored phone (may be E.164 in phone_number). */
    static parseStoredPhone(storedPhone: string | null | undefined, storedDialCode?: string | null): {
        dialCode: string;
        nationalNumber: string;
    };
    /** Display E.164-style phone from stored dial + national parts. */
    static formatDisplayPhone(national: string | null | undefined, dialCode?: string | null): string;
    /** @deprecated use isPlausibleNationalNumber */
    static isPlausiblePhone(phone: string): boolean;
}
export {};
//# sourceMappingURL=helpers.d.ts.map