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
     * @type {boolean}
     */
    forceDontAutoInitialize;

    /**
     * @param {AbstractComponentOptions} options
     * @param {boolean=} forceDontAutoInitialize
     * @return {AbstractComponentOptions}
     */
    static of(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        return _.defaults(new AbstractComponentOptions(), options, {
            state: options.state ?? new StateHolder(),
            config: options.config ?? ComponentConfiguration.configWithDefaults(options.view?.$elem),
            forceDontAutoInitialize
        });
    }
}