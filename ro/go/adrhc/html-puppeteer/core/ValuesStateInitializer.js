import StateInitializer from "./StateInitializer";

export default class ValuesStateInitializer extends StateInitializer {
    /**
     * @type {*}
     */
    values;

    /**
     * @param {*} values
     * @param {StateHolder} stateHolder
     */
    constructor(values, stateHolder) {super();}

    /**
     * loads this.values into stateHolder
     */
    load() {
        this.stateHolder.replace(this.values);
    }
}