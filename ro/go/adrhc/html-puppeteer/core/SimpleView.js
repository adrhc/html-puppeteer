import AbstractTemplatingView from "./AbstractTemplatingView.js";
import {generateHtml} from "../util/HtmlGenerator.js";

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
        this.$elem.html(generateHtml(this.htmlTemplate, values))
    }
}