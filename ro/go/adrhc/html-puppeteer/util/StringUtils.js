export default class StringUtils {
    /**
     * @param {string} str
     * @return {string}
     */
    static toCamelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    /**
     * @param {string} str
     * @return {string}
     */
    static toTitleCase(str) {
        const temp = StringUtils.toCamelCase(str);
        return temp.charAt(0).toUpperCase() + temp.substring(1).toLowerCase()
    }
}