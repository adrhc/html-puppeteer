class SelectableFactory {
    createSelectableRow(
        tableId = "selectableTable", {
            state = new SelectableState(),
            deselectedRowTmpl,
            deselectedRowTmplHtml,
            selectedRowTmpl,
            selectedRowTmplHtml,
            putAtBottomIfNotExists
        }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, deselectedRowTmpl);
        const view = new SelectableRowView(mustacheTableElemAdapter, {
            deselectedRowTmpl,
            deselectedRowTmplHtml,
            selectedRowTmpl,
            selectedRowTmplHtml,
            putAtBottomIfNotExists
        });
        return new SelectableRow(mustacheTableElemAdapter, state, view);
    }
}