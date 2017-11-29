/**
 * Generates a random number between min and max
 * @param {number} min
 * @param {number} max
 */
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Wait x ms
 * @param {number} time
 */
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));


export { getRandomInt, sleep }