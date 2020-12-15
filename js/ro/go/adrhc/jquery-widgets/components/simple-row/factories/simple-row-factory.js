class SimpleRowFactory {
    createSimpleRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            putAtBottomIfNotExists
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            putAtBottomIfNotExists
        });
        return new SimpleRow(mustacheTableElemAdapter, state, view);
    }

    createIdentifiableRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            putAtBottomIfNotExists
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            putAtBottomIfNotExists
        });
        return new IdentifiableRow(mustacheTableElemAdapter, state, view);
    }
}