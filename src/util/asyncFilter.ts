export default (array: any[], predicate: Function) => {
    const data = Array.from(array);
    return Promise.all(data.map((element, index) => predicate(element, index, data)))
        .then(result => data.filter((element, index) => result[index]))
}