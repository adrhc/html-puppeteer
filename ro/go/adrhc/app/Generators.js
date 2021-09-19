import {rangeIterator} from "../html-puppeteer/util/StreamUtils.js";

/**
 * @typedef {{[key:string]:*}} Dogs
 * @typedef {{[key:string]:*}} Cats
 * @property {{id: string, name: string}} dogs
 */

/**
 * @typedef {{name: PartName, value: *}} Part
 */

/**
 * @param {number} max
 * @return {Part}
 */
export function generateDogsOrCats(max) {
    if (_.random(1, 2) % 2) {
        return {name: "dogs", value: generateDogs(max)};
    } else {
        return {name: "cats", value: generateCats(max)};
    }
}

/**
 * @param {number} max
 * @return {Cats}
 */
export function generateCats(max) {
    return _generate(max, "cat");
}

/**
 * @param {number} max
 * @return {Dogs}
 */
export function generateDogs(max) {
    return _generate(max, "dog");
}

function _generate(max, property) {
    const generation = _.random(1, 1000);
    const count = _.random(1, max);
    const dogs = [];
    rangeIterator(1, count, (i) => {
        dogs.push({id: i, name: `[generation=${generation}] ${property}${i}`});
    });
    return dogs;
}

export function generateAndAppendDogs(max, object) {
    object.dogs = generateDogs(max);
    return object;
}