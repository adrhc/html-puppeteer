import AbstractComponent from "./AbstractComponent.js";

/**
 * @abstract
 */
export default class AbstractContainerComponent extends AbstractComponent {
    /**
     * @param {PartName} partName
     * @param {string} type is the child component type
     * @param {AbstractComponentOptions=} options are the child component options
     * @param {boolean=} dontRender
     * @return {AbstractComponent}
     */
    create(partName, type, options, dontRender) {}

    /**
     * @param {PartName} partName
     */
    removeByName(partName) {}

    /**
     * @param {PartName} fromPartName
     * @param {PartName} toPartName
     */
    move(fromPartName, toPartName) {}
}