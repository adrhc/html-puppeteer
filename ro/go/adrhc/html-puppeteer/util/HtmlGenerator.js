/**
 * @param {string} htmlTemplate
 * @param {{}} values
 * @return {string}
 */
export function generateHtml(htmlTemplate, values) {
    const template = Handlebars.compile(htmlTemplate);
    return template(values);
}
