class SimpleRowFactory {
    create(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            removeOnEmptyState,
            putAtBottomIfNotExists
        }) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            removeOnEmptyState,
            putAtBottomIfNotExists
        });
        return new SimpleRow(mustacheTableElemAdapter, state, view);
    }
}