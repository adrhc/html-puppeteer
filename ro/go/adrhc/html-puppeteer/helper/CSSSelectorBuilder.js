import {dataOwnerSelectorOf, dataSelectorOf} from "../util/SelectorUtils.js";

/**
 * @typedef {Bag} CSSSelectorBuilderOptions
 * @property {string} owner is the component id used as *owner* on a DOM element
 * @property {string} dataAttrName
 */
export class CSSSelectorBuilder {
    /**
     * Is the component id used as *owner* on a DOM element.
     *
     * @type {string}
     * @protected
     */
    componentId;
    /**
     * @type {string}
     * @protected
     */
    dataAttribute;

    /**
     * @param {CSSSelectorBuilderOptions} options
     */
    constructor({owner, dataAttrName} = {}) {
        this.componentId = owner;
        this.dataAttribute = dataAttrName;
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
    dataAttrName(dataAttributeName) {
        this.dataAttribute = dataAttributeName;
        return this;
    }

    /**
     * @param {string} dataAttributeName
     * @return {CSSSelectorBuilder}
     */
    withDataAttributeName(dataAttributeName) {
        return this.dataAttrName(dataAttributeName);
    }

    /**
     * @return {string} the CSS selector
     */
    selector() {
        // [data-owner="componentId"][data-dataAttribName]
        return `${dataOwnerSelectorOf(this.componentId)}${dataSelectorOf(this.dataAttribute)}`;
    }

    $elem() {
        return $(this.selector());
    }
}

/**
 * @param {CSSSelectorBuilderOptions=} options
 * @return {CSSSelectorBuilder}
 */
export function css(options) {
    return new CSSSelectorBuilder(options);
}
