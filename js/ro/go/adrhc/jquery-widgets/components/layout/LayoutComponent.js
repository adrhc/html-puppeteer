class LayoutComponent extends AbstractComponent {
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
        return super.init();
    }

    _reloadState() {
        if (this.config.dontReloadFromState) {
            return super._reloadState();
        } else {
            return this._stateChangePromiseFromState();
        }
    }

    /**
     * @return {StateChange}
     * @protected
     */
    _stateChangeFromState() {
        console.debug(`${this.constructor.name}._stateChangeFromState:\n${JSON.stringify(this.state.currentState)}`);
        return new StateChange(this.config.stateChangeRequest, this.state.currentState);
    }

    /**
     * @return {Promise<StateChange>}
     * @protected
     */
    _stateChangePromiseFromState() {
        return new Promise((resolve) => {
            const stateChange = this._stateChangeFromState();
            this.state.collectStateChange(stateChange);
            setTimeout(() => resolve(stateChange))
        })
    }
}