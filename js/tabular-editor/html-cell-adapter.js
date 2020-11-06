/**
 * Cell having a "data-name" attribute and containing an input element (possibly hidden).
 */
class HtmlCellAdapter {
    /**
     * @param cell: HTMLTableDataCellElement
     */
    constructor(cell) {
        this.cell = cell;
    }

    hasChildField() {
        return this.getChildField(this.cell).length > 0;
    }

    hasHiddenChildField() {
        return this.getChildField(this.cell).is(":hidden");
    }

    setChildFieldValue(text) {
        this.getChildField(this.cell).val(text);
    }

    prependTextNode(text) {
        if (text == null) {
            return;
        }
        const textNode = document.createTextNode(text);
        this.cell.prepend(textNode);
    }

    /**
     * private
     */
    getChildField() {
        return $(this.cell).find(`input[name='${this.name}']`)
    }

    /**
     * private
     */
    get name() {
        return this.cell.dataset['name'];
    }
}