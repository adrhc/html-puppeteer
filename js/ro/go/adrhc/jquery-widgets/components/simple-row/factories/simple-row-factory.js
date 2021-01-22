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
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
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
                identifiableRowComponent, {rowTmplId: errorRowTmplId, rowTmplHtml: errorRowTmplHtml});
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
     * The error row is presented as a "data-secondary-row-part".
     *
     * @param parentRow {IdentifiableRowComponent} the parent row for the error row
     * @param rowTmplId {string} error row template id
     * @param rowTmplHtml {string} error row html
     * @return {IdentifiableRowComponent}
     */
    static createErrorRow(parentRow, {rowTmplId, rowTmplHtml}) {
        return SimpleRowFactory.createIdentifiableRow({
            tableIdOrJQuery: parentRow.simpleRowView.tableAdapter.$table,
            childishBehaviour: new ChildishBehaviour(parentRow),
            rowTmplId, rowTmplHtml
        });
    }
}