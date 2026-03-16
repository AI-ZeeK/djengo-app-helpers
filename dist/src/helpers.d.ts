export declare class Helpers {
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
     * Validates an email address format
     * @param email Email address to validate
     * @returns boolean indicating if email is valid
     */
    static isValidEmail(email: string): boolean;
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
}
//# sourceMappingURL=helpers.d.ts.map