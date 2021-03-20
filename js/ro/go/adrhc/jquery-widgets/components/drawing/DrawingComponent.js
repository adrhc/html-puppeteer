class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerStateHolder} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = ComponentConfiguration.configOf(elemIdOrJQuery),
                state, view) {
        super(elemIdOrJQuery, config);
        config.clearChildrenOnReset = _.defaultTo(config.clearChildrenOnReset, true)
    }

    update(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        return this.resetThenUpdate(stateOrPart, {partName, dontRecordStateEvents});
    }
}