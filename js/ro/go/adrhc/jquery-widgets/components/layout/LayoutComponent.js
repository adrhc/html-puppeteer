class LayoutComponent extends AbstractComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {BasicState} [state]
     * @param {DefaultTemplatingView} [view]
     * @param {ComponentConfiguration} [config]
     */
    constructor(elemIdOrJQuery,
                config = DomUtils.jQueryOf(elemIdOrJQuery).data(),
                state = new BasicState(),
                view = new DefaultTemplatingView(elemIdOrJQuery, config)) {
        super(state, view, config);
        if (config.dontAutoInitialize) {
            return;
        }
        return super.init();
    }

    _reloadState() {
        if (this.config.dontLoadStateFromData) {
            return super._reloadState();
        } else {
            return new Promise((resolve) => {
                console.debug(`${this.constructor.name}._reloadState:\n${JSON.stringify(this.config)}`);
                const stateChange = new StateChange(this.config.stateChangeRequest, this.config);
                this.state.collectStateChange(stateChange);
                setTimeout(() => resolve(stateChange))
            })
        }
    }
}