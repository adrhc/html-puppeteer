import AbstractView from "./AbstractView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {templateTextOf} from "../../util/HtmlUtils.js";
import {isTrue} from "../../util/AssertionUtils.js";

/**
 * @typedef {Object} AbstractTemplateViewOptions
 * @property {jQuery<HTMLElement>} $elem
 * @property {string|jQuery<HTMLElement>} elemIdOrJQuery
 * @property {string} htmlTemplate
 * @property {string} templateId
 */
export default class AbstractTemplateView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $elem;
    /**
     * @type {string}
     */
    htmlTemplate;

    /**
     * @param {AbstractTemplateViewOptions} options
     */
    constructor({$elem, elemIdOrJQuery, htmlTemplate, templateId} = {}) {
        super();
        this.$elem = $elem ?? this._createElem(elemIdOrJQuery);
        this.htmlTemplate = htmlTemplate ?? this._createTemplate(templateId)
        isTrue(!!this.htmlTemplate, `HTML template not provided! elemId = ${this.$elem.attr("id")}, data-part = ${this.$elem.data("part")}`)
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