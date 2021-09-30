import SimpleComponent from "./SimpleComponent.js";
import GlobalConfig, {partOf} from "../../util/GlobalConfig.js";
import {jQueryOf} from "../../util/DomUtils.js";

export default class ValueComponent extends SimpleComponent {
    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options) {
        super({htmlTemplate: htmlTemplateOf(options), ...options});
    }
}

function htmlTemplateOf({elemIdOrJQuery}) {
    return partOf(jQueryOf(elemIdOrJQuery)) == null ? "{{this}}" : `{{${GlobalConfig.VIEW_VALUE_FIELD}}}`;
}