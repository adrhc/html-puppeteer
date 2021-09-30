export function encodeHTML(s) {
    if (s == null) {
        return s;
    }
    return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;').split("'").join('&#39;');
}

export function uniqueId(prefix = "id") {
    return `${prefix}-${_.uniqueId()}`;
}
