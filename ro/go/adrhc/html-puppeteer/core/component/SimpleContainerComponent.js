import PUPPETEER from "../Puppeteer.js";
import {USE_HTML} from "../view/SimpleView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {createByType} from "../ComponentsFactories.js";
import SimplePartComponentIllustrator from "../state-changes-handler/SimplePartComponentIllustrator.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";
import {addComponentIllustratorProvider} from "./options/AbstractComponentOptionsBuilder.js";
import {addDebugger} from "./options/DebuggerOptionsBuilder.js";

/**
 * @typedef {{[key: string]: AbstractContainerComponent}} ComponentsCollection
 */
/**
 * @typedef {AbstractComponentOptions} SimpleContainerComponentOptions
 * @property {ComponentsCollection} components
 */
/**
 * @extends {AbstractContainerComponent}
 */
export default class SimpleContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ComponentsCollection}
     */
    components;

    /**
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {SimpleContainerComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super(addComponentIllustratorProvider(config =>
            (componentIllustrator ?? new SimplePartComponentIllustrator(config)))
            .to(restOfOptions));
        this.components = restOfOptions.components ?? {};
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        super.render(value);
        PUPPETEER.animate(addDebugger({debuggerElemIdOrJQuery: "children-debugger"})
            .to({
                // PUPPETEER.animate({
                parent: this,
                viewRemovalStrategy: USE_HTML,
                onRemoveViewHtml: "child component was removed!"
                // }, false, jQueryOf(this.config.elemIdOrJQuery), true);
            }), false, jQueryOf(this.config.elemIdOrJQuery), true);
        // .forEach(c => this.components);
        return this;
    }

    /**
     * @param {PartName} partName
     * @param {string} type is the child component type
     * @param {SimpleContainerComponentOptions=} options are the child component options
     * @param {boolean=} dontRender
     * @return {AbstractComponent}
     */
    create(partName, type, options, dontRender) {
        const $childElem = $(`[data-part="${partName}"]`, jQueryOf(this.config.elemIdOrJQuery));
        this.components[partName] = createByType(type, {elemIdOrJQuery: $childElem, type, ...options});
        if (!dontRender) {
            this.components[partName].render();
        }
    }

    /**
     * @param {PartName} partName
     */
    removeByName(partName) {
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
    move(fromPartName, toPartName) {
        const fromComponent = this.components[fromPartName]
        this.removeByName(fromPartName);
        this.create(toPartName, fromComponent.config.type, fromComponent.options);
    }
}