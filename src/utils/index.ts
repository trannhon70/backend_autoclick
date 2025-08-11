//thời gian hết hạn redis
export const expirationTime = 8 * 60 * 60 * 1000; // 8 giờ (milliseconds)
export const expiresIn = '8h'

// export const expirationTime = 30 * 1000; // 30 giây (milliseconds)
// export const expiresIn = '30s'; // 30 giây


export function currentTimestamp() {
    const currentDateTime = new Date(); // Get the current date and time
    const localTime = currentDateTime.getTime()  // Adjust for Vietnam time
    return Math.floor(localTime / 1000); // Return as seconds
}