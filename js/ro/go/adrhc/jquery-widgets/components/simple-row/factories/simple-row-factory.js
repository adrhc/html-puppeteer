class SimpleRowFactory {
    static createSimpleRow(
        {
            tableIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
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
            simpleRowComponent.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
        return simpleRowComponent;
    }

    static createIdentifiableRow(
        {
            tableIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
            tableRelativePositionOnCreate,
            neighbourRowDataIdSupplier,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter,
                tableRelativePositionOnCreate, neighbourRowDataIdSupplier),
            state = new SimpleRowState(),
            identifiableRowComponent = new IdentifiableRowComponent(state, simpleRowView),
            childCompFactories,
            childishBehaviour,
            errorRowTmplId,
            errorRowTmplHtml,
        }
    ) {
        if (errorRowTmplId || errorRowTmplHtml) {
            identifiableRowComponent.errorComponent = SimpleRowFactory.createErrorRow(
                identifiableRowComponent, {errorRowTmplId, errorRowTmplHtml});
        }
        if (childishBehaviour) {
            identifiableRowComponent.childishBehaviour = childishBehaviour;
        }
        if (childCompFactories) {
            identifiableRowComponent.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
        return identifiableRowComponent;
    }

    /**
     * @param parentRow {IdentifiableRowComponent}
     * @param rowTmplId {string}
     * @param rowTmplHtml {string}
     * @return {IdentifiableRowComponent}
     */
    static createErrorRow(parentRow, {
        rowTmplId,
        rowTmplHtml
    }) {
        const errorRow = SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: parentRow.simpleRowView.tableAdapter.$table, rowTmplId, rowTmplHtml,
            state: new ErrorRowState(), neighbourRowDataIdSupplier: () => parentRow.state.currentState.id
        });
        errorRow.childishBehaviour = new ChildishBehaviour(parentRow);
        return errorRow;
    }
}