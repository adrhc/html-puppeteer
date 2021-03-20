class ContainerComponent extends AbstractComponent {
    /**
     * @type {ContainerStateHolder}
     */
    containerStateHolder;

    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {ContainerStateHolder} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = ComponentConfiguration.configOf(DomUtils.dataOf(elemIdOrJQuery), {updateViewOnce: true}),
                state = new ContainerStateHolder({initialState: config}),
                view = new DefaultTemplatingView(elemIdOrJQuery, config)) {
        super(state, view, config);
        this.handleWithAny();
        this.containerStateHolder = state;
        if (config.dontAutoInitialize) {
            return;
        }
        return super.init().then(() => this);
    }

    processStateChanges(stateChangeOrJustData, {dontRecordStateEvents}) {
        return super.processStateChanges(stateChangeOrJustData, {dontRecordStateEvents});
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
            const stateChange = this.containerStateHolder.collectStateChangeOfSelf();
            setTimeout(() => resolve(stateChange))
        })
    }
}