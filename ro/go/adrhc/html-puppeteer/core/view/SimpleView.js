import AbstractTemplateView from "./AbstractTemplateView.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

export default class SimpleView extends AbstractTemplateView {
    /**
     * @param {{}} values
     */
    create(values) {
        this.replace(values);
    }

    /**
     * @param {{}} values
     */
    replace(values) {
        this.$elem.html(generateHtml(this.htmlTemplate, values) ?? "")
    }
}