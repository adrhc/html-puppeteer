import AbstractView from "./AbstractView.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";
import {jQueryOf} from "../../util/Utils.js";
import {cancelSwitchOff, switchOff} from "../../util/DomUtils.js";

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
 * @typedef {Object} ViewElementOptions
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery (aka "configuration-source" element)
 * @property {jQuery<HTMLElement>=} $elem is the element corresponding to elemIdOrJQuery
 * @property {string|jQuery<HTMLElement>=} renderElemIdOrJQuery is the element where all rendering will happen
 * @property {jQuery<HTMLElement>=} $renderElem is the element corresponding to renderElemIdOrJQuery
 */
/**
 * @typedef {ViewElementOptions & AbstractTemplateViewOptions} SimpleViewOptions
 * @property {ViewValuesTransformerFn=} viewValuesTransformer
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {ViewRenderStrategy=} viewRenderStrategy
 * @property {string=} removedPlaceholder is the text or html to be used when the component is removed
 * @property {string=} removedCss is the class to add to the $elem when the component is removed
 */
/**
 * @typedef {function()} LazySetupWorker
 */
export default class SimpleView extends AbstractView {
    /**
     * @return {jQuery<HTMLElement>}
     */
    $configElem;
    /**
     * @type {string}
     */
    removedCss;
    /**
     * @type {string}
     */
    removedPlaceholder;
    /**
     * @type {ViewElementOptions}
     */
    viewElementOptions
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
    viewValuesTransformer;

    /**
     * @return {jQuery<HTMLElement>}
     */
    get $renderElem() {
        isTrue(!!this.viewElementOptions, `[SimpleView] viewElementOptions can't be null!`)
        return renderElemOf(this.viewElementOptions) ?? this.$configElem;
    }

    /**
     * @param {SimpleViewOptions} options
     * @param {ViewElementOptions} viewElementOptions
     */
    constructor({
                    viewValuesTransformer,
                    viewRemovalStrategy,
                    viewRenderStrategy,
                    removedPlaceholder,
                    removedCss,
                    ...viewElementOptions
                }) {
        super();
        this.viewElementOptions = viewElementOptions;
        this.viewValuesTransformer = viewValuesTransformer ?? (values => values);
        this.viewRemovalStrategy = viewRemovalStrategy ?? (removedPlaceholder != null ? USE_HTML : REMOVE_ELEMENT);
        this.$configElem = configElemOf(viewElementOptions);
        this.viewRenderStrategy = viewRenderStrategy ??
            (this.$configElem.is("textarea") ? RENDER_VAL : RENDER_HTML);
        this.removedPlaceholder = removedPlaceholder;
        this.removedCss = removedCss;
    }

    /**
     * @param {{}} values
     */
    create(values) {
        this._removalStrategyIsCss() && this._cancelCssRemoval();
        this.replace(values);
    }

    /**
     * @param {*} values
     */
    replace(values) {
        const viewValues = this.viewValuesTransformer(values);
        this.$renderElem[this.viewRenderStrategy](viewValues != null ? JSON.stringify(viewValues, undefined, 2) : "");
    }

    /**
     * handles REMOVED state change event
     */
    remove() {
        switch (this.viewRemovalStrategy) {
            case REMOVE_ELEMENT:
                this.$renderElem.remove();
                break;
            case REMOVE_CONTENT:
                this.$renderElem[this.viewRenderStrategy]("");
                break;
            case USE_HTML:
                this.$renderElem.html(this.removedPlaceholder);
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
    _cancelCssRemoval() {
        if (this.removedCss) {
            this.$renderElem.removeClass(this.removedCss);
        } else {
            cancelSwitchOff(this.$renderElem);
        }
    }

    /**
     * @protected
     */
    _removeWithCss() {
        if (this.removedCss) {
            this.$renderElem.addClass(this.removedCss);
        } else {
            switchOff(this.$renderElem);
        }
    }
}

/**
 * @param {{}} params
 * @param {jQuery<HTMLElement>=} params.$elem
 * @param {ElemIdOrJQuery=} params.elemIdOrJQuery
 * @return {jQuery<HTMLElement>} $elem (if not null) otherwise use elemIdOrJQuery
 */
export function configElemOf(params) {
    return params.$elem ?? jQueryOf(params.elemIdOrJQuery);
}

/**
 * @param {{}} params
 * @param {jQuery<HTMLElement>=} params.$renderElem
 * @param {ElemIdOrJQuery=} params.renderElemIdOrJQuery
 * @return {jQuery<HTMLElement>} $elem (if not null) otherwise use elemIdOrJQuery
 */
export function renderElemOf(params) {
    return params.$renderElem ?? jQueryOf(params.renderElemIdOrJQuery);
}

/**
 * @param {{}} params
 * @param {jQuery<HTMLElement>=} params.$elem
 * @param {ElemIdOrJQuery=} params.elemIdOrJQuery
 * @param {jQuery<HTMLElement>=} params.$renderElem
 * @param {ElemIdOrJQuery=} params.renderElemIdOrJQuery
 * @return {jQuery<HTMLElement>} $elem (if not null) otherwise use elemIdOrJQuery
 */
export function renderOrConfigElemOf(params) {
    return renderElemOf(params) ?? configElemOf(params);
}
