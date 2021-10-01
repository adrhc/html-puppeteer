import {templateOf} from "../../util/DomUtils.js";
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
        this.htmlTemplate = templateOf({htmlTemplate, templateId, $elem: this.$elem});
        isTrue(this.htmlTemplate != null, `[AbstractTemplateView] HTML template not provided! elemId = ${this.$elem.attr("id")}, data-part = ${this.$elem.data("part")}`)
    }
}