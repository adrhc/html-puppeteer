class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param {AbstractTableBasedView} view
     * @param {StateHolder=} state
     * @param compositeBehaviour
     * @param childCompFactories
     * @param {ChildishBehaviour=} childishBehaviour
     * @param parentComponent
     * @param {ComponentConfiguration=} config
     */
    constructor({
                    view,
                    state,
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent,
                    config
                }) {
        const _this = super({
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config
        });
        this.tableBasedView = view;
        return _this;
    }
}