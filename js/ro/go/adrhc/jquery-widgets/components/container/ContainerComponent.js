class ContainerComponent extends AbstractComponent {
    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {BasicState} [state]
     * @param {DefaultTemplatingView} [view]
     * @param {ComponentConfiguration} [config]
     */
    constructor(elemIdOrJQuery,
                config = $.extend(new ComponentConfiguration(),
                    {clearChildrenOnReset: true}, DomUtils.jQueryOf(elemIdOrJQuery).data()),
                state = new BasicState(config),
                view = new DefaultTemplatingView(elemIdOrJQuery, config)) {
        super(state, view, config);
        if (config.dontAutoInitialize) {
            return;
        }
        return super.init().then(() => this);
    }

    _reloadState() {
        if (this.config.dontReloadFromState) {
            return super._reloadState();
        } else {
            return this._stateChangePromiseFromState();
        }
    }

    /**
     * @return {Promise<StateChange>}
     * @protected
     */
    _stateChangePromiseFromState() {
        return new Promise((resolve) => {
            console.debug(`${this.constructor.name}._stateChangePromiseFromState`);
            console.debug(JSON.stringify(this.state.currentState));
            const stateChange = new StateChange(this.config.stateChangeRequest, this.state.currentState);
            this.state.collectStateChange(stateChange);
            setTimeout(() => resolve(stateChange))
        })
    }
}