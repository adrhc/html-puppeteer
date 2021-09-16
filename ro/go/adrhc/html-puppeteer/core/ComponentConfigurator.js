export default class ComponentConfigurator {
    /**
     * @param {AbstractComponent} abstractComponent
     */
    configure(abstractComponent) {
        this._setComponentDefaults(abstractComponent);
        this._configureStateChangesHandlerAdapter(abstractComponent.stateChangesHandlerAdapter);
        this._executeExtraConfigurators(abstractComponent);
    }

    /**
     * @param {AbstractComponent} abstractComponent
     * @protected
     */
    _executeExtraConfigurators(abstractComponent) {
        const {extraConfigurators, ...otherOptions} = abstractComponent.options;
        abstractComponent.options = otherOptions;
        extraConfigurators?.forEach(c => c.configure(abstractComponent));
    }

    /**
     * @param {AbstractComponent} abstractComponent
     * @protected
     */
    _setComponentDefaults(abstractComponent) {
    }

    /**
     * @param {StateChangesHandlerAdapter} stateChangesHandlerAdapter
     * @protected
     */
    _configureStateChangesHandlerAdapter(stateChangesHandlerAdapter) {}
}

/**
 * @param {function(component: StateChangesHandlerAdapter)} configureStateChangesHandlerAdapterFn
 * @return {ComponentConfigurator}
 */
export function stateChangesHandlerAdapterExtraConfiguratorOf(configureStateChangesHandlerAdapterFn) {
    const cc = new ComponentConfigurator();
    cc._configureStateChangesHandlerAdapter = configureStateChangesHandlerAdapterFn;
    return cc;
}

/**
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {ComponentConfigurator}
 */
export function defaultsExtraConfiguratorOf(setComponentDefaultsFn) {
    const cc = new ComponentConfigurator();
    cc._setComponentDefaults = setComponentDefaultsFn;
    return cc;
}
