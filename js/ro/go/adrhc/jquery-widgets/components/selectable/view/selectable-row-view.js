class SelectableRowView extends AbstractTableView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param deselectedRowTmpl {string}
     * @param deselectedRowTmplHtml {string}
     * @param selectedRowTmpl {string}
     * @param selectedRowTmplHtml {string}
     * @param putAtBottomIfNotExists {boolean}
     */
    constructor(mustacheTableElemAdapter, {
        deselectedRowTmpl,
        deselectedRowTmplHtml,
        selectedRowTmpl,
        selectedRowTmplHtml,
        putAtBottomIfNotExists
    }) {
        super(mustacheTableElemAdapter);
        this.putAtBottomIfNotExists = false;
        this.deselectedRowTmplHtml = HtmlUtils.prototype.templateOf(deselectedRowTmpl, deselectedRowTmplHtml);
        this.selectedRowTmplHtml = HtmlUtils.prototype.templateOf(selectedRowTmpl, selectedRowTmplHtml);
    }

    /**
     * @param stateChange {StateChange}
     */
    update(stateChange) {
        if (!this.supports(stateChange)) {
            return Promise.reject(stateChange);
        }
        const selected = stateChange.state.selected;
        const item = stateChange.state.item;
        if (selected && this.selectedRowTmplHtml) {
            this.mustacheTableElemAdapter.renderRowBeforeDataId(item.id,
                this.selectedRowTmplHtml, item, true, this.putAtBottomIfNotExists);
        }
        if (!selected && this.deselectedRowTmplHtml) {
            this.mustacheTableElemAdapter.renderRowBeforeDataId(item.id,
                this.deselectedRowTmplHtml, item, true, this.putAtBottomIfNotExists);
        }
        return Promise.resolve(stateChange);
    }

    /**
     * @param stateChange {StateChange}
     */
    supports(stateChange) {
        return stateChange.operation === "SELECT";
    }
}