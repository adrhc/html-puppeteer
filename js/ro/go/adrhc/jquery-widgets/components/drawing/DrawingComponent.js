class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerStateHolder} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = ComponentConfiguration.dataAttributesOf(elemIdOrJQuery, {
                    updateViewOnce: false,
                    clearChildrenOnReset: true
                }),
                state, view) {
        super(elemIdOrJQuery, {config});
    }

    /**
     * @param {*} stateOrPart
     * @param {string|number} [partName]
     * @param {boolean} [dontRecordStateEvents]
     * @return {Promise<StateChange[]>}
     */
    resetThenUpdate(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        this.reset();
        // this.runtimeConfig.skipOwnViewUpdates = false;
        return super.update(stateOrPart, {partName, dontRecordStateEvents});
    }

    update(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        return this.resetThenUpdate(stateOrPart, {partName, dontRecordStateEvents});
    }
}