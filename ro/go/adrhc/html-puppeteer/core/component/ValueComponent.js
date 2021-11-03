import SimpleComponent from "./SimpleComponent.js";
import GlobalConfig, {partOf} from "../../util/GlobalConfig.js";
import {jQueryOf} from "../../util/Utils.js";
import {handlebarsWrap} from "../../util/HtmlGenerator.js";

/**
 * @typedef {AbstractComponentOptions} ValueComponentOptions
 * @property {boolean} escapeHtml
 */
export default class ValueComponent extends SimpleComponent {
    /**
     * @param {ValueComponentOptions} options
     */
    constructor(options) {
        super({...options, htmlTemplate: htmlTemplateOf(options)});
    }
}

function htmlTemplateOf({escapeHtml, elemIdOrJQuery}) {
    return partOf(jQueryOf(elemIdOrJQuery)) == null ?
        handlebarsWrap("this", escapeHtml) :
        handlebarsWrap(GlobalConfig.VIEW_VALUE_FIELD, escapeHtml);
}
