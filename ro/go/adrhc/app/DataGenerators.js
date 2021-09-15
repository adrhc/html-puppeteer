import {rangeIterator} from "../html-puppeteer/util/StreamUtils.js";

/**
 * @param {number} max
 * @return {{}[]}
 */
export function generateDogs(max) {
    const count = _.random(1, max);
    const dogs = [];
    rangeIterator(1, count, (i) => {
        dogs.push({id: i, name: `dog${i}`});
    });
    return dogs;
}