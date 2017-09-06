

const getRandomItem = (array: any[]): any => {
    return array.length > 0
        ? array[Math.floor(Math.random() * array.length)]
        : {};
}


export { getRandomItem }