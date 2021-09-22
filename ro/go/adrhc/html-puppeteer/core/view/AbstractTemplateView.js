import {templateTextOf} from "../../util/HtmlUtils.js";
import {isTrue} from "../../util/AssertionUtils.js";
import SimpleView from "./SimpleView.js";

/**
 * @typedef {SimpleViewOptions} AbstractTemplateViewOptions
 * @property {string} htmlTemplate
 * @property {string} templateId
 */
export default class AbstractTemplateView extends SimpleView {
    /**
     * @type {string}
     */
    htmlTemplate;

    /**
     * @param {AbstractTemplateViewOptions} options
     * @param {SimpleViewOptions} options.restOfOptions
     */
    constructor({htmlTemplate, templateId, ...restOfOptions}) {
        super(restOfOptions);
        this.htmlTemplate = htmlTemplate ?? this._createTemplate(templateId)
        isTrue(!!this.htmlTemplate, `HTML template not provided! elemId = ${this.$elem.attr("id")}, data-part = ${this.$elem.data("part")}`)
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