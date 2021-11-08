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
     * @type {string|number|boolean|undefined}
     * @protected
     */
    dataAttributeValue;

    /**
     * @param {CSSSelectorBuilderOptions} options
     */
    constructor({owner, dataAttrName, dataAttributeValue} = {}) {
        this.componentId = owner;
        this.dataAttribute = dataAttrName;
        this.dataAttributeValue = dataAttributeValue;
    }

    owner(componentId) {
        this.componentId = componentId;
        return this;
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
     * @param {string} dataAttributeValue
     * @return {CSSSelectorBuilder}
     */
    dataAttrValue(dataAttributeValue) {
        this.dataAttributeValue = dataAttributeValue;
        return this;
    }

    /**
     * @return {string} the CSS selector
     */
    selector() {
        if (this.dataAttributeValue == null) {
            // [data-owner="componentId"][data-dataAttribName]
            return `${dataOwnerSelectorOf(this.componentId)}${dataSelectorOf(this.dataAttribute)}`;
        } else {
            // [data-owner="componentId"][data-dataAttribName="dataAttributeValue"]
            return `${dataOwnerSelectorOf(this.componentId)}${dataSelectorOf(this.dataAttribute, this.dataAttributeValue)}`;
        }
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

/**
 * e.g. <div owner="componentX" data-attrY="value" />
 *
 * @param {string} owner is a component id
 * @param {string} dataAttrName is the data attribute of the DOM element having also "owner"
 * @return {string|number|boolean} the value of the data attribute with the name dataAttrName on the element described above
 */
export function dataAttrValueOfOwnedDataAttr(owner, dataAttrName) {
    return elemOfOwnedDataAttr(owner, dataAttrName)?.data(dataAttrName);
}

/**
 * @param {string} owner is a component id
 * @param {string} dataAttrName is the data attribute of the DOM element having also "owner"
 * @return {string}
 */
export function ownedDataAttrSelectorOf(owner, dataAttrName) {
    return css().owner(owner).dataAttrName(dataAttrName).selector();
}

/**
 * @param {string} owner is a component id
 * @param {string} dataAttrName is the data attribute of the DOM element having also "owner"
 * @return {jQuery<HTMLElement>|undefined}
 */
export function elemOfOwnedDataAttr(owner, dataAttrName) {
    const $elem = css().owner(owner).dataAttrName(dataAttrName).$elem();
    return $elem.length ? $elem : undefined;
}