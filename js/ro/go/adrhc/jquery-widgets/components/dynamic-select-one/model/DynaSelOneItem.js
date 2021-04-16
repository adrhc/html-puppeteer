/**
 * this relates to the found items
 */
class DynaSelOneItem {
    /**
     * @type {number|string}
     */
    id;

    constructor(id, title, description, optionText) {
        this.id = id;
        this._title = title;
        this._description = description;
        this._optionText = optionText;
    }

    /**
     * @return {string} the searched value
     */
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    /**
     * @return {string} the found value placed near the search (title) value
     */
    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    /**
     * @return {string} the text to show in the list with findings
     */
    get optionText() {
        return this._optionText;
    }

    set optionText(value) {
        this._optionText = value;
    }
}