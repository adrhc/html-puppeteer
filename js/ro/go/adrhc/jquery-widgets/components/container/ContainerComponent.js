/**
 * updateViewOnce: if not true, a state update might remove children's HTML elements
 * clearChildrenOnReset: reset makes sense here only if followed by an init() but in that case old children will loose their HTML elements
 */
class ContainerComponent extends AbstractComponent {
    /**
     * @type {TaggingStateHolder}
     */
    containerStateHolder;

    /**
     * @param {string|jQuery<HTMLElement} elemIdOrJQuery
     * @param {ComponentConfiguration} [config]
     * @param {TaggingStateHolder} [state]
     * @param {DefaultTemplatingView} [view]
     */
    constructor(elemIdOrJQuery,
                config = ComponentConfiguration.configOf(elemIdOrJQuery),
                state = new TaggingStateHolder({initialState: config}),
                view = new DefaultTemplatingView(elemIdOrJQuery, config)) {
        super(state, view, config);
        config.updateViewOnce = _.defaultTo(true, config.updateViewOnce);
        config.clearChildrenOnReset = _.defaultTo(true, config.clearChildrenOnReset);
        this.handleWithAny();
        this.containerStateHolder = state;
        if (config.dontAutoInitialize) {
            return;
        }
        return super.init().then(() => this);
    }

    /**
     * @param {*} stateOrPart
     * @param {string|number} [partName]
     * @param {boolean} [dontRecordStateEvents]
     * @return {Promise<StateChange[]>}
     */
    resetThenUpdate(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        this.reset();
        this.runtimeConfig.skipOwnViewUpdates = false;
        return super.update(stateOrPart, {partName, dontRecordStateEvents});
    }

    _reloadState() {
        if (this.config.dontReloadFromState) {
            return super._reloadState();
        } else {
            return this._promiseStateChangeOfSelf();
        }
    }

    /**
     * @return {Promise<StateChange>}
     * @protected
     */
    _promiseStateChangeOfSelf() {
        return new Promise((resolve) => {
            console.debug(`${this.constructor.name}._stateChangePromiseFromState`);
            console.debug(JSON.stringify(this.state.currentState));
            const stateChange = this._collectStateChangeOfSelf();
            setTimeout(() => resolve(stateChange))
        })
    }

    _collectStateChangeOfSelf() {
        const stateChange = new StateChange(undefined, this.state.currentState);
        return this.state.collectStateChange(stateChange)
    }
}