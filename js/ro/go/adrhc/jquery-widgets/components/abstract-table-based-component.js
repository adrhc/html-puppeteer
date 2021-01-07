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
     * When this.extractAllInputValues exists than this.extractAllEntities must use it instead of using super.extractAllEntities!
     * Drawback: this approach ignores this.compositeComponent (aka kids)!
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.tableBasedView.extractAllRowsInputValues(useOwnerOnFields)
            .map(it => EntityUtils.removeTransientId(it));
    }
}