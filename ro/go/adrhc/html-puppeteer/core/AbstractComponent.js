import DefaultComponentConfigurator from "./DefaultComponentConfigurator.js";

/**
 * @typedef {Object} AbstractComponentOptions
 * @property {ComponentConfigurator[]=} extraConfigurators
 * @property {string=} elemIdOrJQuery
 * @property {StateHolder=} stateHolder
 * @property {StateInitializer=} stateInitializer
 * @property {*=} initialState
 * @property {StateChangesHandlerAdapter=} stateChangesHandlerAdapter
 * @property {string=} allChangesMethod
 * @property {string=} allPartChangesMethod
 * @property {string=} partMethodPrefix
 * @property {StateChangesHandler[]=} stateChangesHandlers
 * @property {ComponentIllustrator=} componentIllustrator
 * @property {PartsAllocator=} partsAllocator
 * @property {StateChangesHandler[]=} extraStateChangesHandlers
 */
/**
 * @typedef {AbstractComponentOptions} AbstractComponentOptionsWithConfigurator
 * @property {ComponentConfigurator=} configurator
 */
export default class AbstractComponent {
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {AbstractComponentOptions}
     */
    options;
    /**
     * @type {StateChangesHandlerAdapter}
     */
    stateChangesHandlerAdapter;
    /**
     * @type {StateHolder}
     */
    stateHolder;
    /**
     * @type {StateInitializer}
     */
    stateInitializer;

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     * @param {ComponentConfigurator=} options.configurator
     * @param {AbstractComponentOptions=} restOfOptions
     */
    constructor({configurator, ...restOfOptions}) {
        configurator = configurator ?? this._createComponentConfigurator(restOfOptions);
        configurator.configure(this);
    }

    /**
     * @param {AbstractComponentOptions} options
     * @protected
     */
    _createComponentConfigurator(options) {
        return new DefaultComponentConfigurator(options);
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        if (value != null) {
            this.doWithState(sh => {
                sh.replace(value);
            });
        } else if (this.stateInitializer) {
            this._initializeState();
        }
        return this;
    }

    /**
     * @protected
     */
    _initializeState() {
        this.doWithState((stateHolder) => {
            this.stateInitializer.load(stateHolder);
        });
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param {function(state: StateHolder)} stateUpdaterFn
     * @return {StateChange[]}
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        this.stateChangesHandlerAdapter.processStateChanges(this.stateHolder.stateChangesCollector);
    }

    /**
     * set state to undefined
     */
    close() {
        this.stateHolder.replace();
    }
}

/**
 * @param {AbstractComponentOptionsWithConfigurator} options
 * @param {ComponentConfigurator} configuratorToAppend
 * @return {AbstractComponentOptionsWithConfigurator}
 */
export function extraConfiguratorsOf(options, configuratorToAppend) {
    options.extraConfigurators = options.extraConfigurators ?? [];
    options.extraConfigurators.push(configuratorToAppend);
    return options;
}