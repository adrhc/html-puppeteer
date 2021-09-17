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
        // extraConfigurators must be removed from component.options to
        // not be again and again processed by _executeExtraConfigurators
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
 * @param {AbstractComponentOptions} options
 * @param {function(component: StateChangesHandlerAdapter)} configureStateChangesHandlerAdapterFn
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withStateChangesHandlerAdapterConfiguratorOf(options, configureStateChangesHandlerAdapterFn) {
    return withExtraConfiguratorsOf(options, stateCHAConfiguratorOf(configureStateChangesHandlerAdapterFn))
}

/**
 * @param {AbstractComponentOptions} options
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withDefaultsConfiguratorOf(options, setComponentDefaultsFn) {
    return withExtraConfiguratorsOf(options, defaultsConfiguratorOf(setComponentDefaultsFn))
}

/**
 * @param {AbstractComponentOptionsWithConfigurator} options
 * @param {ComponentConfigurator} configuratorToAppend
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function withExtraConfiguratorsOf(options, configuratorToAppend) {
    options.extraConfigurators = options.extraConfigurators ?? [];
    options.extraConfigurators.push(configuratorToAppend);
    return options;
}

/**
 * @param {function(stateChangesHandlerAdapter: StateChangesHandlerAdapter)} configureStateChangesHandlerAdapterFn
 * @return {ComponentConfigurator}
 */
export function stateCHAConfiguratorOf(configureStateChangesHandlerAdapterFn) {
    const cc = new ComponentConfigurator();
    cc._configureStateChangesHandlerAdapter = configureStateChangesHandlerAdapterFn;
    return cc;
}

/**
 * @param {function(component: AbstractComponent)} setComponentDefaultsFn
 * @return {ComponentConfigurator}
 */
export function defaultsConfiguratorOf(setComponentDefaultsFn) {
    const cc = new ComponentConfigurator();
    cc._setComponentDefaults = setComponentDefaultsFn;
    return cc;
}
