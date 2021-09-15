export default class ComponentConfigurer {
    /**
     * @param {AbstractComponent} abstractComponent
     */
    configure(abstractComponent) {
        this._setComponentDefaults(abstractComponent);
        this._configureStateChangesHandlerAdapter(abstractComponent.stateChangesHandlerAdapter);
    }

    /**
     * @param {AbstractComponent} abstractComponent
     */
    _setComponentDefaults(abstractComponent) {
    }

    /**
     * @param {StateChangesHandlerAdapter} stateChangesHandlerAdapter
     */
    _configureStateChangesHandlerAdapter(stateChangesHandlerAdapter) {}
}