import StateInitializer from "./StateInitializer.js";

export default class ValuesStateInitializer extends StateInitializer {
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