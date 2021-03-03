class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerState} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = $.extend(new ComponentConfiguration(),
                    {clearChildrenOnReset: true}, DomUtils.jQueryOf(elemIdOrJQuery).data()),
                state, view) {
        super(elemIdOrJQuery, config);
    }

    processStateChange(stateChangeOrJustData, {dontRecordStateEvents}) {
        super.reset();
        return super.processStateChange(stateChangeOrJustData, {dontRecordStateEvents});
    }
}