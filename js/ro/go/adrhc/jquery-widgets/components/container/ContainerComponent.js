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
                {
                    config = ComponentConfiguration.configWithDataAttributesOf(elemIdOrJQuery, {
                        updateViewOnce: true,
                        clearChildrenOnReset: true
                    }),
                    state = new TaggingStateHolder({initialState: config}),
                    view = new DefaultTemplatingView(elemIdOrJQuery, config)
                } = {}) {
        super({state, view, config: config.dontAutoInitializeOf()});
        this.handleWithAny();
        this.containerStateHolder = state;
        if (!config.dontAutoInitialize) {
            return this.init().then(() => this);
        }
    }

    _reloadState() {
        console.debug(`${this.constructor.name}._reloadState`);
        console.debug(JSON.stringify(this.state.currentState));
        if (this.config.dontReloadFromState) {
            return super._reloadState();
        } else {
            const stateChange = this._collectStateChangeOfSelf();
            return Promise.resolve(stateChange.stateOrPart);
        }
    }

    _collectStateChangeOfSelf() {
        const stateChange = new StateChange(undefined, this.state.currentState);
        return this.state.collectStateChange(stateChange)
    }
}