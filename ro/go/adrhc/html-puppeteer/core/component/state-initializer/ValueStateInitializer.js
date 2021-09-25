import StateInitializer from "./StateInitializer.js";

/**
 * @template SCT, SCP
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
     * @param {AbstractComponent<SCT, SCP>} component
     */
    load(component) {
        component.replaceState(this.value);
    }
}