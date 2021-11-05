import SimpleComponent from "./SimpleComponent.js";
import GlobalConfig, {partOf} from "../../util/GlobalConfig.js";
import {jQueryOf} from "../../util/Utils.js";
import {handlebarsWrap} from "../../util/HtmlGenerator.js";
import {configOf} from "./configurator/DefaultComponentConfigurator.js";

/**
 * @typedef {AbstractComponentOptions} ValueComponentOptions
 * @property {boolean=} dontEscapeHtml
 */
export default class ValueComponent extends SimpleComponent {
    /**
     * @param {ValueComponentOptions} options
     */
    constructor(options) {
        super({htmlTemplate: htmlTemplateOf(options), ...options});
    }
}

function htmlTemplateOf({dontEscapeHtml, elemIdOrJQuery}) {
    dontEscapeHtml = configOf({dontEscapeHtml, elemIdOrJQuery}, "dontEscapeHtml");
    // this relates to ComponentIllustrator calling hierarchyAwareViewValuesTransformer(...)
    return partOf(jQueryOf(elemIdOrJQuery)) == null ?
        handlebarsWrap("this", dontEscapeHtml) :
        handlebarsWrap(GlobalConfig.VIEW_VALUE_FIELD, dontEscapeHtml);
}
