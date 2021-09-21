import StateInitializer from "./StateInitializer.js";

/**
 * @typedef {Bag} ValueStateInitializerOptions
 * @property {*} initialState
 */
export default class ValueStateInitializer extends StateInitializer {
    /**
     * @type {*}
     */
    value;

    /**
     * @param {*} value
     */
    constructor(value) {
        super();
        this.value = value;
    }

    /**
     * loads this.values into stateHolder
     */
    load(stateHolder) {
        stateHolder.replace(this.value);
    }
}