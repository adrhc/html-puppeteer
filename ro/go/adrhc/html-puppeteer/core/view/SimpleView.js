import AbstractView from "./AbstractView.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";
import {jQueryOf} from "../../util/Utils.js";

export const REMOVE_ELEMENT = "REMOVE_ELEMENT";
export const REMOVE_CONTENT = "REMOVE_CONTENT";
export const USE_HTML = "USE_HTML";

export const RENDER_VAL = "val";
export const RENDER_TEXT = "text";
export const RENDER_HTML = "html";

/**
 * @typedef {function(values: *): *} ViewValuesTransformerFn
 */
/**
 * @typedef {"REMOVE_ELEMENT"|"REMOVE_CONTENT"|"USE_HTML"} ViewRemovalStrategy
 */
/**
 * @typedef {"RENDER_VAL"|"RENDER_TEXT"|"RENDER_HTML"} ViewRenderStrategy
 */
/**
 * @typedef {AbstractTemplateViewOptions} SimpleViewOptions
 * @property {ViewValuesTransformerFn=} viewValuesTransformerFn
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery
 * @property {jQuery<HTMLElement>=} $elem
 * @property {ViewRemovalStrategy=} viewRenderStrategy
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {string=} removedPlaceholder is the text or html to be used when the component is removed
 */
/**
 * @typedef {function()} LazySetupWorker
 */
export default class SimpleView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $elem;
    /**
     * @type {LazySetupWorker[]}
     */
    lazySetupWorkers = [];
    /**
     * @type {string}
     */
    removedPlaceholder;
    /**
     * @type {ViewRemovalStrategy}
     */
    viewRemovalStrategy;
    /**
     * @type {ViewRenderStrategy}
     */
    viewRenderStrategy;
    /**
     * @type {ViewValuesTransformerFn}
     */
    viewValuesTransformerFn;

    /**
     * @param {SimpleViewOptions} options
     */
    constructor({
                    viewValuesTransformerFn,
                    elemIdOrJQuery,
                    $elem,
                    viewRenderStrategy,
                    viewRemovalStrategy,
                    removedPlaceholder
                }) {
        super();
        this.viewValuesTransformerFn = viewValuesTransformerFn ?? ((values) => values);
        this.$elem = $elem ?? jQueryOf(elemIdOrJQuery);
        this.lazySetupWorkers.push(() => this.$elem = $elem ?? jQueryOf(elemIdOrJQuery));
        this.lazySetupWorkers.push(() => this.viewRenderStrategy =
            viewRenderStrategy ?? (this.$elem.is("textarea") ? RENDER_VAL : RENDER_HTML));
        this.viewRemovalStrategy = viewRemovalStrategy ?? (removedPlaceholder != null ? USE_HTML : REMOVE_ELEMENT);
        this.removedPlaceholder = removedPlaceholder;
        this.$elem.length && this._execLazySetup(true);
    }

    /**
     * The setup depending on DOM $elem can be executed later when maybe the DOM $elem is finally available.
     * This will work for some limited use cases, e.g. debugger component.
     *
     * @param {boolean=} forced
     */
    _execLazySetup(forced) {
        if (!forced && this.$elem.length) {
            return;
        }
        this.lazySetupWorkers.forEach(it => it());
        isTrue(!!this.$elem.length, `Missing view $elem!`);
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
        const viewValues = this.viewValuesTransformerFn(values);
        this._execLazySetup();
        this.$elem[this.viewRenderStrategy](viewValues != null ? JSON.stringify(viewValues, undefined, 2) : "");
    }

    /**
     * handles REMOVED state change event
     */
    remove() {
        switch (this.viewRemovalStrategy) {
            case REMOVE_ELEMENT:
                this._execLazySetup();
                this.$elem.remove();
                break;
            case REMOVE_CONTENT:
                this._execLazySetup();
                this.$elem[this.viewRenderStrategy]("");
                break;
            case USE_HTML:
                this._execLazySetup();
                this.$elem.html(this.removedPlaceholder);
                break;
            default:
                alertOrThrow(`Bad viewRemovalStrategy! this.viewRemovalStrategy = ${this.viewRemovalStrategy}`);
        }
    }
}