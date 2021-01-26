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

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get optionText() {
        return this._optionText;
    }

    set optionText(value) {
        this._optionText = value;
    }
}