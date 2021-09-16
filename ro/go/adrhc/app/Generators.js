import {rangeIterator} from "../html-puppeteer/util/StreamUtils.js";

/**
 * @typedef {{[key:string]:*}} Dogs
 * @property {{id: string, name: string}} dogs
 */
/**
 * @param {number} max
 * @param {DataAttributes} dataAttributes
 * @return {Dogs}
 */
export function generateDogs(max, dataAttributes = {}) {
    const count = _.random(1, max);
    const dogs = [];
    rangeIterator(1, count, (i) => {
        dogs.push({id: i, name: `dog${i}`});
    });
    return {dogs, ...dataAttributes};
}