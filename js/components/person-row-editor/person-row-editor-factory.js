class PersonRowEditorFactory {
    create(
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
        return new PersonRowEditor(state, view);
    }
}