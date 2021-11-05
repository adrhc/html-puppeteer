/**
 * @param {string} htmlTemplate
 * @param {{}} values
 * @return {string}
 */
import {isTrue} from "./AssertionUtils.js";

export function generateHtml(htmlTemplate, values) {
    isTrue(htmlTemplate != null, `[generateHtml] HTML template not provided! values: ${JSON.stringify(values)}`)
    const template = Handlebars.compile(htmlTemplate);
    return template(values);
}

/**
 * @param {string} string
 * @param {boolean=} dontEscapeHtml
 * @return {string}
 */
export function handlebarsWrap(string, dontEscapeHtml) {
    return dontEscapeHtml ? `{{{${string}}}}` : `{{${string}}}`;
}