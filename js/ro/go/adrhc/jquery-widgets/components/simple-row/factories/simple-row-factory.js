class SimpleRowFactory {
    static createSimpleRow(
        {
            tableIdOrJQuery,
            rowTmpl,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmpl),
            tableRelativePositionOnCreate,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
            state = new SimpleRowState(),
            simpleRowComponent = new SimpleRowComponent(state, simpleRowView),
            childCompFactories
        }
    ) {
        if (childCompFactories) {
            simpleRowComponent.addChildComponentFactory(childCompFactories);
        }
        return simpleRowComponent;
    }

    static createIdentifiableRow(
        {
            tableIdOrJQuery,
            rowTmpl,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmpl),
            tableRelativePositionOnCreate,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
            state = new SimpleRowState(),
            identifiableRowComponent = new IdentifiableRowComponent(state, simpleRowView),
            childCompFactories
        }
    ) {
        if (childCompFactories) {
            identifiableRowComponent.addChildComponentFactory(childCompFactories);
        }
        return identifiableRowComponent;
    }
}