/**
 * Returns a random string of specified length
 */
export function generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Returns heavily formatted and clean Date string
 */
export function getFormattedDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

/**
 * Parses pricing/currency and returns raw float
 */
export function parsePrice(priceStr: string): number {
    const cleaned = priceStr.replace(/[^0-9.-]+/g, "");
    return parseFloat(cleaned);
}
