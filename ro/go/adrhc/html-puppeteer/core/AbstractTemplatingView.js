import AbstractView from "./AbstractView.js";
import HtmlUtils from "../util/HtmlUtils.js";
import DomUtils from "../util/DomUtils.js";

/**
 * @typedef {Object} AbstractTemplatingViewOptions
 * @property {jQuery<HTMLElement>} $elem
 * @property {string|jQuery<HTMLElement>} elemIdOrJQuery
 * @property {string} htmlTemplate
 * @property {string} templateId
 */
export default class AbstractTemplatingView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $elem;
    /**
     * @type {string}
     */
    htmlTemplate;

    /**
     * @param {AbstractTemplatingViewOptions} options
     */
    constructor({$elem, elemIdOrJQuery, htmlTemplate, templateId} = {}) {
        super();
        this.$elem = $elem ?? this._createElem(elemIdOrJQuery);
        this.htmlTemplate = htmlTemplate ?? this._createTemplate(templateId)
    }

    /**
     * @param {string|jQuery<HTMLElement>} elemIdOrJQuery
     * @protected
     */
    _createElem(elemIdOrJQuery) {
        return DomUtils.jQueryOf(elemIdOrJQuery);
    }

    /**
     * @param {string=} [templateId]
     * @protected
     */
    _createTemplate(templateId) {
        templateId = templateId ?? this.$elem.data("templateId");
        if (templateId) {
            return HtmlUtils.templateTextOf(templateId);
        } else {
            return this.$elem.text();
        }
    }
}