import AbstractView from "./AbstractView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {templateTextOf} from "../../util/HtmlUtils.js";

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
        return jQueryOf(elemIdOrJQuery);
    }

    /**
     * @param {string=} [templateId]
     * @protected
     */
    _createTemplate(templateId) {
        templateId = templateId ?? this.$elem.data("templateId");
        if (templateId) {
            return templateTextOf(templateId);
        } else {
            return this.$elem.text();
        }
    }
}