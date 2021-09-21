import AbstractComponent from "./AbstractComponent.js";
import {createByType} from "../ComponentsFactories.js";
import {jQueryOf} from "../../util/DomUtils.js";

/**
 * @abstract
 */
export default class AbstractContainerComponent extends AbstractComponent {
    /**
     * @type {{[key: string]: AbstractContainerComponent}}
     */
    components = {};

    /**
     * @param {PartName} partName
     * @param {string} type is the child component type
     * @param {AbstractComponentOptions=} options are the child component options
     * @param {boolean=} dontRender
     * @return {AbstractComponent}
     */
    create(partName, type, options, dontRender) {
        const $childElem = $(`[data-part="${partName}"]`, jQueryOf(this.config.elemIdOrJQuery));
        this.components[partName] = createByType(type, {elemIdOrJQuery: $childElem, ...options});
        if (!dontRender) {
            this.components[partName].render();
        }
    }

    /**
     * @param {PartName} partName
     */
    closeByName(partName) {
        if (!this.components[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return;
        }
        this.components[partName].close();
        delete this.components[partName];
    }

    /**
     * @param {PartName} fromPartName
     * @param {PartName} toPartName
     */
    move(fromPartName, toPartName) {}
}