import {StateProcessor} from "../state-processor/StateProcessor.js";
import DefaultComponentConfigurator from "./configurator/DefaultComponentConfigurator.js";
import {applyExtraConfigurators} from "./configurator/ComponentConfigurator.js";

/**
 * @typedef {StateHolderOptions & ValueStateInitializerOptions & StateChangesHandlersInvokerOptions} AbstractComponentOptions
 * @property {string|number|boolean=} id
 * @property {SimpleContainerComponent=} parent
 * @property {PartialStateHolder=} stateHolder
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
 * @template SCT, SCP
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
     * @type {string}
     */
    id;
    /**
     * @type {AbstractComponentOptions}
     */
    options;
    /**
     * @type {AbstractComponent}
     */
    parent;
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
     * @return {SCT}
     */
    getState() {
        return _.cloneDeep(this.stateHolder.currentState);
    }

    /**
     * @param {PartName} partName
     * @return {*}
     */
    getPart(partName) {
        return _.cloneDeep(this.stateHolder.getPart(partName));
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.doWithState(stateHolder => stateHolder.replace(newState));
    }

    /**
     * Replaces a component's state part.
     *
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        this.doWithState(partialStateHolder =>
            partialStateHolder.replacePart(previousPartName, newPart, newPartName));
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        this._initializeState(value);
        this.eventsBinder?.attachEventHandlers();
        return this;
    }

    /**
     * @param {*=} value
     * @protected
     */
    _initializeState(value) {
        if (value != null) {
            this.replaceState(value);
        } else {
            this.stateInitializer?.load(this);
        }
    }

    /**
     * set state to undefined
     */
    close() {
        this.eventsBinder?.detachEventHandlers();
        this.replaceState();
    }
}
