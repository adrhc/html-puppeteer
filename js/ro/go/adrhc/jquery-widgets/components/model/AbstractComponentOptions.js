/**
 * This is the entire AbstractComponent's state (meaning all its internal properties).
 */
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
     * @param {{}=} params
     */
    constructor(params) {
        _.defaults(this, params);
    }
}