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
export function withPeriodicallyGenerateDogsOrCats(consumerFn, max = 2, intervalMs = 1000) {
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
    return generateIdNameBags(max, "cat");
}

/**
 * @param {number} max
 * @return {Dogs}
 */
export function generateDogs(max) {
    return generateIdNameBags(max, "dog");
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
export function generateIdNameBags(max, name) {
    const generation = _.random(1, 1000);
    const count = _.random(1, max);
    const items = [];
    rangeIterator(1, count, (i) => {
        const indexAndGeneration = `${i}${generation}`;
        items.push({id: `${indexAndGeneration}`, name: `[generation=${generation}] ${name} ${indexAndGeneration}`});
    });
    return items;
}

/**
 * @param {Bag} appendToObject to append to the generated dogs
 * @param {number=} [max=5]
 * @return {Bag}
 */
export function generateAndAppendDogs(appendToObject, max = 3) {
    appendToObject.dogs = generateDogs(max);
    return appendToObject;
}

/**
 * @param {string=} prefix
 * @param {string=} suffix
 * @return {string}
 */
export function generateString(prefix = "", suffix = "") {
    return `${prefix}${_.random(1, 1000)}${suffix}`;
}