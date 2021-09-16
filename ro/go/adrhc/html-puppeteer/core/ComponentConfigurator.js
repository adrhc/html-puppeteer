export default class ComponentConfigurator {
    /**
     * @param {AbstractComponent} component
     */
    configure(component) {
        this._setComponentDefaults(component);
        component.eventsBinder.component = component;
        this._configureStateChangesHandlerAdapter(component.stateChangesHandlerAdapter);
        this._executeExtraConfigurators(component);
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _executeExtraConfigurators(component) {
        const {extraConfigurators, ...otherOptions} = component.options;
        component.options = otherOptions;
        extraConfigurators?.forEach(c => c.configure(component));
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setComponentDefaults(component) {}

    /**
     * @param {StateChangesHandlerAdapter} stateChangesHandlerAdapter
     * @protected
     */
    _configureStateChangesHandlerAdapter(stateChangesHandlerAdapter) {}
}

/**
 * @param {function(stateChangesHandlerAdapter: StateChangesHandlerAdapter)} configureStateChangesHandlerAdapterFn
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
