import AbstractView from "./AbstractView.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";
import {jQueryOf} from "../../util/DomUtils.js";

export const REMOVE_ELEMENT = "REMOVE_ELEMENT";
export const REMOVE_CONTENT = "REMOVE_CONTENT";
export const USE_HTML = "USE_HTML";

export const RENDER_VAL = "val";
export const RENDER_TEXT = "text";
export const RENDER_HTML = "html";

/**
 * @typedef {"REMOVE_ELEMENT"|"REMOVE_CONTENT"|"USE_HTML"} ViewRemovalStrategy
 */
/**
 * @typedef {AbstractTemplateViewOptions} SimpleViewOptions
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery
 * @property {jQuery<HTMLElement>=} $elem
 * @property {ViewRemovalStrategy=} viewRenderStrategy
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {string=} removedPlaceholder is the text or html to be used when the component is removed
 */
export default class SimpleView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $elem;
    /**
     * @type {string}
     */
    removedPlaceholder;
    /**
     * @type {ViewRemovalStrategy}
     */
    viewRemovalStrategy;

    /**
     * @param {SimpleViewOptions} options
     */
    constructor({elemIdOrJQuery, $elem, viewRenderStrategy, viewRemovalStrategy, removedPlaceholder}) {
        super();
        this.$elem = $elem ?? this._createElem(elemIdOrJQuery);
        this.viewRenderStrategy = viewRenderStrategy ?? (this.$elem.is("textarea") ? RENDER_VAL : RENDER_HTML);
        this.viewRemovalStrategy = viewRemovalStrategy ?? REMOVE_ELEMENT;
        this.removedPlaceholder = removedPlaceholder ?? "";
        isTrue(this.viewRemovalStrategy !== USE_HTML || !!this.removedPlaceholder);
    }

    /**
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     * @protected
     */
    _createElem(elemIdOrJQuery) {
        return jQueryOf(elemIdOrJQuery);
    }

    /**
     * @param {{}} values
     */
    create(values) {
        this.replace(values);
    }

    /**
     * @param {*} values
     */
    replace(values) {
        this.$elem[this.viewRenderStrategy](values != null ? JSON.stringify(values, undefined, 2) : "")
    }

    /**
     * handles REMOVED state change event
     */
    remove() {
        switch (this.viewRemovalStrategy) {
            case REMOVE_ELEMENT:
                this.$elem.remove();
                break;
            case REMOVE_CONTENT:
                this.replace("");
                break;
            case USE_HTML:
                this.$elem.html(this.removedPlaceholder);
                break;
            default:
                alertOrThrow(`Bad viewRemovalStrategy! this.viewRemovalStrategy = ${this.viewRemovalStrategy}`);
        }
    }
}