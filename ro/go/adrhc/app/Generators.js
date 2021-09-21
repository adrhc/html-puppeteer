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
 * @param {function(part: Part)} consumerFn
 * @param {number} [max=5]
 * @param {number=} intervalMs
 */
export function withPeriodicallyGenerateDogsOrCats(consumerFn, max = 5, intervalMs = 1000) {
    setInterval(() => {
        const catsOrDogs = generateDogsOrCats(max);
        consumerFn(catsOrDogs)
    }, intervalMs);
}

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

/**
 * Generate an "max" size array like this:
 * {
 *  id: 1-based-index,
 *  name: "[generation=${generation}] ${name}${id}"
 * }
 *
 * @param {number} max
 * @param {string} name
 * @return {Bag[]}
 */
function _generate(max, name) {
    const generation = _.random(1, 1000);
    const count = _.random(1, max);
    const dogs = [];
    rangeIterator(1, count, (i) => {
        dogs.push({id: i, name: `[generation=${generation}] ${name}${i}`});
    });
    return dogs;
}

/**
 * @param {number} max
 * @param {Bag} object to append to the generated dogs
 * @return {Bag}
 */
export function generateAndAppendDogs(max, object) {
    object.dogs = generateDogs(max);
    return object;
}