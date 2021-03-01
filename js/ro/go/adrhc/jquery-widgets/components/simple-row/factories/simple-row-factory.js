class SimpleRowFactory {
    /**
     * @param [tableIdOrJQuery]
     * @param [rowTmplId]
     * @param [rowTmplHtml]
     * @param [mustacheTableElemAdapter]
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [neighbourRelativePosition] {"before"|"after"}
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
            tableIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
            tableRelativePositionOnCreate,
            neighbourRelativePosition,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate, neighbourRelativePosition),
            initialState,
            state = new StateHolder({currentState: initialState}),
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
     * @param [tableIdOrJQuery]
     * @param [rowTmplId]
     * @param [rowTmplHtml]
     * @param [mustacheTableElemAdapter]
     * @param [tableRelativePositionOnCreate] {"prepend"|"append"}
     * @param [neighbourRelativePosition] {"before"|"after"}
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
            tableIdOrJQuery,
            rowTmplId,
            rowTmplHtml,
            mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
            tableRelativePositionOnCreate,
            neighbourRelativePosition,
            simpleRowView = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate, neighbourRelativePosition),
            initialState,
            state = new StateHolder({currentState: initialState}),
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
            tableIdOrJQuery: parentRow.simpleRowView.tableAdapter.$table,
            childishBehaviour: new ChildishBehaviour(parentRow),
            rowTmplId, rowTmplHtml
        });
    }
}