class DrawingComponent extends ContainerComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {BasicState} [state]
     * @param {DefaultTemplatingView} [view]
     * @param {ComponentConfiguration} [config]
     */
    constructor(elemIdOrJQuery,
                config = $.extend(new ComponentConfiguration(),
                    {clearChildrenOnReset: true}, DomUtils.jQueryOf(elemIdOrJQuery).data())) {
        super(elemIdOrJQuery, config);
    }

    processStateChange(stateChangeOrJustData, dontRecordStateEvents) {
        super.reset();
        return super.processStateChange(stateChangeOrJustData, dontRecordStateEvents);
    }
}