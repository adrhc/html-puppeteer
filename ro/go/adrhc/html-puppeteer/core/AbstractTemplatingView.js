import AbstractView from "./AbstractView.js";
import HtmlUtils from "../util/HtmlUtils.js";
import DomUtils from "../util/DomUtils.js";

export default class AbstractTemplatingView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $elem;
    /**
     * @type {string}
     */
    htmlTemplate;

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
        if (templateId) {
            return HtmlUtils.templateTextOf(templateId);
        } else {
            return this.$elem.html();
        }
    }
}