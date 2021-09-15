export default class ComponentConfigurator {
    /**
     * @param {AbstractComponent} abstractComponent
     */
    configure(abstractComponent) {
        this._setComponentDefaults(abstractComponent);
        this._configureStateChangesHandlerAdapter(abstractComponent.stateChangesHandlerAdapter);
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