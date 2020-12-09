class EditableRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, config);
    }

    show(item) {
        super.show(this.itemViewOf(item));
        this.focusFirstInput(item.id);
    }

    /**
     * appends htmlId to cloned cellValues then return it
     * @param item {IdentifiableEntity}
     */
    itemViewOf(item) {
        if (!item) {
            return undefined;
        }
        const htmlId = EntityUtils.prototype.hasEmptyId(item) ? "" : item.id;
        return {id: item.id, htmlId: htmlId, item: item};
    }

    /**
     * @param rowId {string}
     * @return {any}
     */
    valuesFor(rowId) {
        return FormUtils.prototype.objectifyInputsOf(this._$rowByDataId(rowId))
    }

    /**
     * private method
     */
    focusFirstInput(rowId) {
        const $row = this._$rowByDataId(rowId);
        const $inputToFocus = $row.find("[data-focus-me='true']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }

    /**
     * @param rowId
     * @return {jQuery<HTMLTableRowElement>}
     * @private
     */
    _$rowByDataId(rowId) {
        return this.mustacheTableElemAdapter.$getRowByDataId(rowId);
    }
}