export function currentTimestamp() {
    const currentDateTime = new Date(); // Get the current date and time
    const localTime = currentDateTime.getTime()  // Adjust for Vietnam time
    return Math.floor(localTime / 1000); // Return as seconds
}

export const CHECK_ROLE = {
    ADMIN:1,
    USER: 2
}