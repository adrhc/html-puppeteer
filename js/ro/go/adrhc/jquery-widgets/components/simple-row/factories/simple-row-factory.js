class SimpleRowFactory {
    createSimpleRow(
        tableId = "selectableTable",
        {
            state = new SimpleRowState(),
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate,
            componentSpecifications
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        const simpleRowComponent = new SimpleRowComponent(state, view);
        if (componentSpecifications) {
            simpleRowComponent.addComponentSpec(componentSpecifications);
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
            componentSpecifications
        }
    ) {
        const mustacheTableElemAdapter = new MustacheTableElemAdapter(tableId, rowTmpl);
        const view = new SimpleRowView(mustacheTableElemAdapter, {
            rowTmpl,
            rowTmplHtml,
            tableRelativePositionOnCreate
        });
        const identifiableRowComponent = new IdentifiableRowComponent(state, view);
        if (componentSpecifications) {
            identifiableRowComponent.addComponentSpec(componentSpecifications);
        }
        return identifiableRowComponent;
    }
}