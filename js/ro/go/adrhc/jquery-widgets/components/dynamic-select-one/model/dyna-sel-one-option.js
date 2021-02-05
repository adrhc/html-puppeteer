/**
 * this relates to the <select/> options
 */
class DynaSelOneOption {
    /**
     * @type {number|string}
     */
    id;
    /**
     * @type {string}
     */
    text;
    /**
     * @type {""|"selected"}
     */
    selected;

    /**
     * @param id {number|string}
     * @param text {string}
     * @param [selected=""] {""|"selected"}
     */
    constructor(id, text, selected = "") {
        this.id = id;
        this.text = text;
        this.selected = selected;
    }
}