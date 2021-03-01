class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param state {StateHolder}
     * @param view {AbstractTableBasedView}
     * @param {ComponentConfiguration} [config]
     */
    constructor(state, view, config) {
        super(state, view, config);
        this.tableBasedView = view;
    }
}