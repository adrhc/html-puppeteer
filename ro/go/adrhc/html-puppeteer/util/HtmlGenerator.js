export default class HtmlGenerator {
    /**
     * @param {string} htmlTemplate
     * @param {{}} values
     * @return {string}
     */
    static generateHtml(htmlTemplate, values) {
        const template = Handlebars.compile(htmlTemplate);
        return template(values);
    }
}