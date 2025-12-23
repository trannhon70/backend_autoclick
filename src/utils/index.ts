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

    // Lấy thời gian hiện tại theo giờ Việt Nam
    const vnNow = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    );

    // Bắt đầu ngày (00:00:00 VN)
    const startVN = new Date(vnNow);
    startVN.setHours(0, 0, 0, 0);

    // Kết thúc ngày (23:59:59.999 VN)
    const endVN = new Date(vnNow);
    endVN.setHours(23, 59, 59, 999);

    // Trả về timestamp UTC (giây)
    return {
        start: Math.floor(startVN.getTime() / 1000),
        end: Math.floor(endVN.getTime() / 1000),
    };
}
