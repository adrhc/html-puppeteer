class SimpleRowFactory {
    /**
     * @param [elemIdOrJQuery]
     * @param [rowTmplId]
     * @param [rowTmplHtml]
     * @param [mustacheTableElemAdapter]
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [simpleRowView]
     * @param [initialState]
     * @param [state]
     * @param [simpleRowComponent]
     * @param [childCompFactories]
     * @param [childishBehaviour]
     * @return {SimpleRowComponent}
     */
    static createSimpleRow(
        {
            elemIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, rowTmplId, rowTmplHtml),
            tableRelativePositionOnCreate,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
            initialState,
            state = new TaggingStateHolder({initialState}),
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

    /**
     * @param [elemIdOrJQuery]
     * @param [rowTmplId]
     * @param [rowTmplHtml]
     * @param [mustacheTableElemAdapter]
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [simpleRowView]
     * @param [initialState]
     * @param [state]
     * @param [identifiableRowComponent]
     * @param [childCompFactories]
     * @param [childishBehaviour]
     * @param [errorRowTmplId]
     * @param [errorRowTmplHtml]
     * @return {IdentifiableRowComponent}
     */
    static createIdentifiableRow(
        {
            elemIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, rowTmplId, rowTmplHtml),
            tableRelativePositionOnCreate,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
            initialState,
            state = new TaggingStateHolder({initialState}),
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
     * @param [rowTmplId] {string} error row template id
     * @param [rowTmplHtml] {string} error row html
     * @return {IdentifiableRowComponent}
     */
    static createErrorRow(parentRow, {rowTmplId, rowTmplHtml}) {
        return SimpleRowFactory.createIdentifiableRow({
            elemIdOrJQuery: parentRow.simpleRowView.tableAdapter.$table,
            childishBehaviour: new ChildishBehaviour(parentRow),
            rowTmplId, rowTmplHtml
        });
    }
}