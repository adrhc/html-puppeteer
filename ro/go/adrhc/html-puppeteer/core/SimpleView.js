import AbstractTemplatingView from "./AbstractTemplatingView.js";
import HtmlGenerator from "../util/HtmlGenerator.js";

export default class SimpleView extends AbstractTemplatingView {
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
        this.$elem.html(HtmlGenerator.generateHtml(this.htmlTemplate, values))
    }
}