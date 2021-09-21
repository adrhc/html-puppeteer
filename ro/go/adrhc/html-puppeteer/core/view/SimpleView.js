import AbstractTemplateView from "./AbstractTemplateView.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";

export const REMOVE_ELEMENT = "REMOVE_ELEMENT";
export const REMOVE_CONTENT = "REMOVE_CONTENT";
export const USE_HTML_TEMPLATE = "USE_THE_TEMPLATE";
export const USE_HTML = "USE_HTML";
/**
 * @typedef {"REMOVE_ELEMENT"|"REMOVE_CONTENT"|"USE_HTML_TEMPLATE"|"USE_HTML"} ViewRemovalStrategy
 */
/**
 * @typedef {AbstractTemplateViewOptions} SimpleViewOptions
 * @property {ViewRemovalStrategy} viewRemovalStrategy
 * @property {string} onRemoveViewHtml
 */
export default class SimpleView extends AbstractTemplateView {
    /**
     * @type {string}
     */
    onRemoveViewHtml;
    /**
     * @type {ViewRemovalStrategy}
     */
    viewRemovalStrategy;

    /**
     * @param {SimpleViewOptions} options
     * @param {AbstractTemplateViewOptions} restOfOptions
     */
    constructor({viewRemovalStrategy, onRemoveViewHtml, ...restOfOptions}) {
        super(restOfOptions);
        this.viewRemovalStrategy = viewRemovalStrategy ?? USE_HTML_TEMPLATE;
        isTrue(viewRemovalStrategy !== USE_HTML || !!onRemoveViewHtml);
        this.onRemoveViewHtml = onRemoveViewHtml ?? "";
    }

    /**
     * @param {{}} values
     */
    create(values) {
        this.replace(values);
    }

    /**
     * @param {{}} values
     */
    replace(values) {
        this.$elem.html(generateHtml(this.htmlTemplate, values) ?? "")
    }

    /**
     * removes the DOM element
     */
    remove() {
        switch (this.viewRemovalStrategy) {
            case REMOVE_ELEMENT:
                this.$elem.remove();
                break;
            case REMOVE_CONTENT:
                this.$elem.html("");
                break;
            case USE_HTML:
                this.$elem.html(this.onRemoveViewHtml);
                break;
            case USE_HTML_TEMPLATE:
                this.$elem.html(generateHtml(this.htmlTemplate) ?? "");
                break;
            default:
                alertOrThrow(`Bad viewRemovalStrategy! this.viewRemovalStrategy = ${this.viewRemovalStrategy}`);
        }
    }
}