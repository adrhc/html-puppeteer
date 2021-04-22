class AbstractComponentOptions {
    /**
     * @type {AbstractView}
     */
    view;
    /**
     * @type {StateHolder}
     */
    state;
    /**
     * @type {CompositeBehaviour}
     */
    compositeBehaviour;
    /**
     * @typedef {function(parentComp: AbstractComponent): AbstractComponent} childCompFactoryFn
     * @type {childCompFactoryFn|childCompFactoryFn[]|ChildComponentFactory|ChildComponentFactory[]}
     */
    childCompFactories;
    /**
     * @type {ChildishBehaviour}
     */
    childishBehaviour;
    /**
     * @type {AbstractComponent}
     */
    parentComponent;
    /**
     * @type {ComponentConfiguration}
     */
    config;
    /**
     * @type {boolean}
     */
    forceDontAutoInitialize;
}