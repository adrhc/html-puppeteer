class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param {AbstractTableBasedView} view
     * @param {StateHolder=} state
     * @param {ChildishBehaviour=} childishBehaviour
     * @param {ComponentConfiguration=} config
     */
    constructor({view, state, childishBehaviour, config}) {
        const _this = super({view, state, childishBehaviour, config});
        this.tableBasedView = view;
        return _this;
    }
}