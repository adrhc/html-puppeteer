class SimpleRowFactory {
    createSimpleRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        return new SimpleRow(mustacheTableElemAdapter, state, view);
    }

    createIdentifiableRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        return new IdentifiableRow(mustacheTableElemAdapter, state, view);
    }
}