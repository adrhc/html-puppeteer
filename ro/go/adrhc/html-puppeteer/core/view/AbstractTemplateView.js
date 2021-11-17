import {templateOf} from "../../util/DomUtils.js";
import {isTrue} from "../../util/AssertionUtils.js";
import SimpleView from "./SimpleView.js";
import {idAttrOf, partOf} from "../../util/GlobalConfig.js";

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
        this.htmlTemplate = templateOf({htmlTemplate, templateId, $elem: this.$configElem});
        isTrue(this.htmlTemplate != null, `[AbstractTemplateView] HTML template not provided! elemId = ${idAttrOf(this.$configElem)}, data-part = ${partOf(this.$configElem)}`)
    }
}
