class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param state {BasicState}
     * @param view {AbstractTableBasedView}
     */
    constructor(state, view) {
        super(state, view);
        this.tableBasedView = view;
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.tableBasedView.extractAllRowsInputValues(useOwnerOnFields)
            .map(it => EntityUtils.removeTransientId(it));
    }
}