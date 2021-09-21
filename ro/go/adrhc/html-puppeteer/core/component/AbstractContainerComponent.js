import AbstractComponent from "./AbstractComponent.js";

/**
 * @abstract
 */
export default class AbstractContainerComponent extends AbstractComponent {
    /**
     * @param {PartName} statePartName
     * @param {string} componentType
     * @param {AbstractComponentOptions=} componentOptions
     * @return {AbstractComponent}
     */
    create(statePartName, componentType, componentOptions) {}

    /**
     * @param {PartName} statePartName
     */
    closeByName(statePartName) {}

    /**
     * @param {PartName} fromPartName
     * @param {PartName} toPartName
     */
    move(fromPartName, toPartName) {}
}