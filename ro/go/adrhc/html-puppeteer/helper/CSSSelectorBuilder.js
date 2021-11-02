import {dataOwnerSelectorOf, dataSelectorOf} from "../util/SelectorUtils.js";

/**
 * @typedef {Bag} CSSSelectorBuilderOptions
 * @property {string} owner is the component id used as *owner* on a DOM element
 * @property {string} dataAttributeName
 */
export class CSSSelectorBuilder {
    /**
     * @type {string}
     * @protected
     */
    dataAttribute;
    /**
     * Is the component id used as *owner* on a DOM element.
     *
     * @type {string}
     * @protected
     */
    componentId;

    /**
     * @param {CSSSelectorBuilderOptions} options
     */
    constructor({owner, dataAttributeName} = {}) {
        this.componentId = owner;
        this.dataAttribute = dataAttributeName;
    }

    owner(componentId) {
        this.componentId = componentId;
        return this;
    }

    /**
     * @param {string} componentId
     * @return {CSSSelectorBuilder}
     */
    withOwner(componentId) {
        return this.owner(this.componentId);
    }

    /**
     * @param {string} dataAttributeName
     * @return {CSSSelectorBuilder}
     */
    dataAttributeName(dataAttributeName) {
        this.dataAttribute = dataAttributeName;
        return this;
    }

    /**
     * @param {string} dataAttributeName
     * @return {CSSSelectorBuilder}
     */
    withDataAttributeName(dataAttributeName) {
        return this.dataAttributeName(dataAttributeName);
    }

    /**
     * @return {string} the CSS selector
     */
    selector() {
        // [data-owner="componentId"][data-dataAttribName]
        return `${dataOwnerSelectorOf(this.componentId)}${dataSelectorOf(this.dataAttribute)}`;
    }
}

/**
 * @param {CSSSelectorBuilderOptions=} options
 * @return {CSSSelectorBuilder}
 */
export function css(options) {
    return new CSSSelectorBuilder(options);
}