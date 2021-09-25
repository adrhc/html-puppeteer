import AbstractTemplateView from "./AbstractTemplateView.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

export const USE_HTML_TEMPLATE = "USE_THE_TEMPLATE";

export default class SimpleTemplateView extends AbstractTemplateView {
    /**
     * @param {{}} values
     */
    replace(values) {
        const viewValues = this.viewValuesTransformerFn(values);
        this.$elem.html(generateHtml(this.htmlTemplate, viewValues) ?? "")
    }

    /**
     * removes the DOM element
     */
    remove() {
        switch (this.viewRemovalStrategy) {
            case USE_HTML_TEMPLATE:
                this.$elem.html(generateHtml(this.htmlTemplate) ?? "");
                break;
            default:
                super.remove();
        }
    }
}

/**
 * @param {AbstractTemplateViewOptions} options
 * @return {SimpleTemplateView}
 */
export function simpleTemplateViewProvider(options) {
    return new SimpleTemplateView(options);
}