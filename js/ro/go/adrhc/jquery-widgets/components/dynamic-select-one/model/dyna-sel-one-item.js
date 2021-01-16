class DynaSelOneItem {
    /**
     * @type {number|string}
     */
    id;

    constructor(id, title, description) {
        this.id = id;
        this._title = title;
        this._description = description;
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
}