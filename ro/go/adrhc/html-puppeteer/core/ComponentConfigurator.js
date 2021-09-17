export default class ComponentConfigurator {
    /**
     * @param {AbstractComponent} component
     */
    configure(component) {
        this._setComponentDefaults(component);
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
