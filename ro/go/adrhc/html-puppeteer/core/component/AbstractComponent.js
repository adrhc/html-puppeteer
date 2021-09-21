import DefaultComponentConfigurator from "./configurator/DefaultComponentConfigurator.js";
import {applyExtraConfigurators} from "./configurator/ComponentConfigurator.js";
import {StateProcessor} from "../state-processor/StateProcessor.js";

/**
 * @typedef {Bag & ValuesStateInitializerOptions & StateChangesHandlersInvoker & AbstractTemplateViewOptionsWithView} AbstractComponentOptions
 * @property {string=} elemIdOrJQuery
 * @property {StateHolder=} stateHolder
 * @property {StateInitializer=} stateInitializer
 * @property {StateChangesHandlersInvoker=} stateChangesHandlersInvoker
 * @property {EventsBinder=} eventsBinder
 * @property {ComponentConfigurator=} configurator
 * @property {ComponentConfigurator[]=} extraConfigurators
 */
/**
 * @typedef {AbstractComponentOptions & DataAttributes} ComponentConfigField
 */
/**
 * @abstract
 */
export default class AbstractComponent extends StateProcessor {
    /**
     * Is options with dataAttributes as defaults.
     *
     * @type {ComponentConfigField}
     */
    config;
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {EventsBinder}
     */
    eventsBinder;
    /**
     * @type {AbstractComponentOptions}
     */
    options;
    /**
     * @type {StateInitializer}
     */
    stateInitializer;

    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options) {
        super(options.stateHolder, options.stateChangesHandlersInvoker);
        const configurator = options.configurator ?? new DefaultComponentConfigurator(options);
        configurator.configure(this);
        applyExtraConfigurators(this);
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
        } else {
            this.doWithState((sh) => {
                this.stateInitializer?.load(sh);
            });
        }
        this.eventsBinder?.attachEventHandlers();
        return this;
    }

    /**
     * set state to undefined
     */
    close() {
        this.eventsBinder?.detachEventHandlers();
        this.doWithState(stateHolder => stateHolder.replace());
    }
}
