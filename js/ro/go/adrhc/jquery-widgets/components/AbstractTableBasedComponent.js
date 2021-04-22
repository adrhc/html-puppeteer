class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param {AbstractTableBasedView} view
     * @param {StateHolder} state
     * @param {CompositeBehaviour=} compositeBehaviour
     * @param {childCompFactoryFn|childCompFactoryFn[]|ChildComponentFactory|ChildComponentFactory[]} [childCompFactories]
     * @param {ChildishBehaviour=} childishBehaviour
     * @param {AbstractComponent=} parentComponent
     * @param {ComponentConfiguration=} config
     * @param {boolean=} forceDontAutoInitialize
     */
    constructor({
                    view,
                    state,
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent,
                    config,
                    forceDontAutoInitialize
                }) {
        const _this = super({
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config,
            forceDontAutoInitialize
        });
        this.tableBasedView = view;
        return _this;
    }
}