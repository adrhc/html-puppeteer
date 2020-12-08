class EditableRow extends ReadOnlyRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param config {{rowTmplId: string, rowTmplHtml: string}}
     */
    constructor(mustacheTableElemAdapter, config) {
        super(mustacheTableElemAdapter, config);
    }

    show(item) {
        super.show(item);
        this.focusFirstInput(item.id);
    }

    /**
     * @param rowId {string}
     * @return {any}
     */
    valuesFor(rowId) {
        return FormUtils.prototype.objectifyInputsOf(this._$rowOf(rowId))
    }

    /**
     * private method
     */
    focusFirstInput(rowId) {
        const $row = this._$rowOf(rowId);
        const $inputToFocus = $row.find("[data-focus-me='true']:visible");
        if ($inputToFocus.length) {
            $inputToFocus.focus();
        }
    }

    _$rowOf(rowId) {
        return this.mustacheTableElemAdapter.$getRowByDataId(rowId);
    }
}