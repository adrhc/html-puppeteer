import animate from "../Puppeteer.js";
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
 * @property {ComponentsCollection} children
 */
/**
 * @extends {AbstractContainerComponent}
 */
export default class SimpleContainerComponent extends AbstractContainerComponent {
    /**
     * @type {ComponentsCollection}
     */
    children;

    /**
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {SimpleContainerComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super(addComponentIllustratorProvider(config =>
            (componentIllustrator ?? new SimplePartComponentIllustrator(config)))
            .to(restOfOptions));
        this._resetChildren();
    }

    /**
     * @protected
     */
    _resetChildren() {
        this.children = this.config.children ?? {};
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {Bag=} newState
     */
    replaceState(newState) {
        super.replaceState(newState);
        this._animateChildren();
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        super.render(value);
        this._animateChildren();
        return this;
    }

    /**
     * @protected
     */
    _animateChildren() {
        this._resetChildren();
        animate(addDebugger({debuggerElemIdOrJQuery: "children-debugger"})
            .to({
                // animate({
                parent: this,
                viewRemovalStrategy: USE_HTML,
                onRemoveViewHtml: "child component was removed!"
                // }, false, jQueryOf(this.config.elemIdOrJQuery), true);
            }), false, jQueryOf(this.config.elemIdOrJQuery), true);
        // .forEach(c => this.children);
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
        this.children[partName] = createByType(type, {elemIdOrJQuery: $childElem, type, ...options});
        if (!dontRender) {
            this.children[partName].render();
        }
    }

    /**
     * @param {PartName} partName
     */
    removeByName(partName) {
        if (!this.children[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return;
        }
        this.children[partName].close();
        delete this.children[partName];
    }

    /**
     * @param {PartName} fromPartName
     * @param {PartName} toPartName
     */
    move(fromPartName, toPartName) {
        const fromComponent = this.children[fromPartName]
        this.removeByName(fromPartName);
        this.create(toPartName, fromComponent.config.type, fromComponent.options);
    }
}