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
            childCompFactories,
            childishBehaviour
        }
    ) {
        if (childishBehaviour) {
            simpleRowComponent.childishBehaviour = childishBehaviour;
        }
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
            childCompFactories,
            childishBehaviour
        }
    ) {
        if (childishBehaviour) {
            identifiableRowComponent.childishBehaviour = childishBehaviour;
        }
        if (childCompFactories) {
            identifiableRowComponent.addChildComponentFactory(childCompFactories);
        }
        return identifiableRowComponent;
    }
}