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
}