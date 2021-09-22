import AbstractTemplateView from "./AbstractTemplateView.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

export const USE_HTML_TEMPLATE = "USE_THE_TEMPLATE";

export default class SimpleTemplateView extends AbstractTemplateView {
    /**
     * @param {{}} values
     */
    replace(values) {
        this.$elem.html(generateHtml(this.htmlTemplate, values) ?? "")
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