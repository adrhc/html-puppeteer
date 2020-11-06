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
        const name = this.getName();
        // return $(this.cell).find(`input[name='${name}'][type='hidden']`).length > 0;
        return this.getChildField(this.cell).is(":hidden");
    }

    putChildFieldValue(text) {
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
        const name = this.getName(this.cell);
        return $(this.cell).find(`input[name='${name}']`)
    }

    /**
     * private
     */
    getName() {
        return this.cell.dataset['name'];
    }
}