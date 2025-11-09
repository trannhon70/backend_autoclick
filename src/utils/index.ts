//thời gian hết hạn redis
// 365 ngày (milliseconds)
export const expirationTime = 365 * 24 * 60 * 60 * 1000; // 365 ngày
export const expiresIn = '365d';

// export const expirationTime = 30 * 1000; // 30 giây (milliseconds)
// export const expiresIn = '30s'; // 30 giây


export function currentTimestamp() {
    const currentDateTime = new Date(); // Get the current date and time
    const localTime = currentDateTime.getTime()  // Adjust for Vietnam time
    return Math.floor(localTime / 1000); // Return as seconds
}

export function getTodayRangeVN() {
    const now = new Date();

    // Lấy giờ Việt Nam (UTC+7)
    const vnOffset = 7 * 60 * 60 * 1000;
    const local = new Date(now.getTime() + vnOffset);

    const start = new Date(local);
    start.setHours(0, 0, 0, 0);

    const end = new Date(local);
    end.setHours(23, 59, 59, 999);

    // Chuyển về UTC timestamp (giây)
    return {
        start: Math.floor((start.getTime() - vnOffset) / 1000),
        end: Math.floor((end.getTime() - vnOffset) / 1000),
    };
}