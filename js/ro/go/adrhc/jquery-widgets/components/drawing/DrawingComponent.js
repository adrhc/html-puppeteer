class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerStateHolder} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = $.extend(new ComponentConfiguration(),
                    {clearChildrenOnReset: true}, DomUtils.jQueryOf(elemIdOrJQuery).data()),
                state, view) {
        super(elemIdOrJQuery, config);
    }

    /**
     * @param {*} stateOrPart
     * @param {string|number} [partName]
     * @param {boolean} [dontRecordStateEvents]
     * @return {Promise<StateChange[]>}
     */
    resetThenUpdate(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        this.reset();
        return super.update(stateOrPart, {partName, dontRecordStateEvents});
    }
}