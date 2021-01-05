class SimpleRowFactory {
    createSimpleRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate,
            childCompSpecs
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        const simpleRowComponent = new SimpleRowComponent(state, view);
        if (childCompSpecs) {
            simpleRowComponent.addComponentSpec(childCompSpecs);
        }
        return simpleRowComponent;
    }

    createIdentifiableRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate,
            childCompSpecs
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        const identifiableRowComponent = new IdentifiableRowComponent(state, view);
        if (childCompSpecs) {
            identifiableRowComponent.addComponentSpec(childCompSpecs);
        }
        return identifiableRowComponent;
    }
}