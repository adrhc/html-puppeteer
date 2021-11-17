import AbstractView from "./AbstractView.js";
import {alertOrThrow} from "../../util/AssertionUtils.js";
import {jQueryOf} from "../../util/Utils.js";
import {disable, enable} from "../../util/DomUtils.js";

// removal strategy
export const REMOVE_ELEMENT = "REMOVE_ELEMENT";
export const REMOVE_CONTENT = "REMOVE_CONTENT";
export const USE_HTML = "USE_HTML";
export const USE_CSS = "USE_CSS";

// rendering strategy
export const RENDER_VAL = "val";
export const RENDER_TEXT = "text";
export const RENDER_HTML = "html";

/**
 * @typedef {function(): jQuery<HTMLElement>} ElemFactory
 */

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
 * @typedef {Object} ViewConfig
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery
 * @property {jQuery<HTMLElement>=} $elem
 * @property {ViewRenderStrategy=} viewRenderStrategy
 */
/**
 * @typedef {ViewConfig & AbstractTemplateViewOptions} SimpleViewOptions
 * @property {ViewValuesTransformerFn=} viewValuesTransformer
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {string=} removedPlaceholder is the text or html to be used when the component is removed
 * @property {string=} removedCss is the class to add to the $elem when the component is removed
 */
/**
 * @typedef {function()} LazySetupWorker
 */
export default class SimpleView extends AbstractView {
    /**
     * @type {string}
     */
    removedCss;
    /**
     * @type {string}
     */
    removedPlaceholder;
    /**
     * @type {ViewConfig}
     */
    viewConfig
    /**
     * @type {ViewRemovalStrategy}
     */
    viewRemovalStrategy;
    /**
     * @type {ViewValuesTransformerFn}
     */
    viewValuesTransformer;

    /**
     * @return {jQuery<HTMLElement>}
     */
    get $elem() {
        return viewElemOf(this.viewConfig);
    }

    /**
     * @return {ViewRenderStrategy}
     */
    get viewRenderStrategy() {
        return this.viewConfig.viewRenderStrategy ??
            (this.$elem.is("textarea") ? RENDER_VAL : RENDER_HTML);
    }

    /**
     * @param {SimpleViewOptions} options
     * @param {ViewConfig} viewConfig
     */
    constructor({
                    viewValuesTransformer,
                    viewRemovalStrategy,
                    removedPlaceholder,
                    removedCss,
                    ...viewConfig
                }) {
        super();
        this.viewValuesTransformer = viewValuesTransformer ?? (values => values);
        this.viewRemovalStrategy = viewRemovalStrategy ?? (removedPlaceholder != null ? USE_HTML : REMOVE_ELEMENT);
        this.removedPlaceholder = removedPlaceholder;
        this.removedCss = removedCss;
        this.viewConfig = viewConfig;
    }

    /**
     * @param {{}} values
     */
    create(values) {
        this._removalStrategyIsCss() && this._discardCssRemoval();
        this.replace(values);
    }

    /**
     * @param {*} values
     */
    replace(values) {
        const viewValues = this.viewValuesTransformer(values);
        this.$elem[this.viewRenderStrategy](viewValues != null ? JSON.stringify(viewValues, undefined, 2) : "");
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
                this.$elem[this.viewRenderStrategy]("");
                break;
            case USE_HTML:
                this.$elem.html(this.removedPlaceholder);
                break;
            case USE_CSS:
                this._removeWithCss();
                break;
            default:
                alertOrThrow(`Bad viewRemovalStrategy! this.viewRemovalStrategy = ${this.viewRemovalStrategy}`);
        }
    }

    /**
     * @return {boolean}
     * @protected
     */
    _removalStrategyIsCss() {
        return this.viewRemovalStrategy === USE_CSS;
    }

    /**
     * @protected
     */
    _discardCssRemoval() {
        if (this.removedCss) {
            this.$elem.removeClass(this.removedCss);
        } else {
            enable(this.$elem);
        }
    }

    /**
     * @protected
     */
    _removeWithCss() {
        if (this.removedCss) {
            this.$elem.addClass(this.removedCss);
        } else {
            disable(this.$elem);
        }
    }
}

/**
 * @param {{}} params
 * @param {jQuery<HTMLElement>=} params.$elem
 * @param {ElemIdOrJQuery=} params.elemIdOrJQuery
 * @return {jQuery<HTMLElement>} $elem (if not null) otherwise use elemIdOrJQuery
 */
export function viewElemOf(params) {
    return params.$elem ?? jQueryOf(params.elemIdOrJQuery);
}