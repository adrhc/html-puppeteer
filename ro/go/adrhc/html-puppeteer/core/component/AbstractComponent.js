import {StateProcessor} from "../state-processor/StateProcessor.js";
import DefaultComponentConfigurator from "./configurator/DefaultComponentConfigurator.js";
import {applyExtraConfigurators} from "./configurator/ComponentConfigurator.js";
import {partsOf} from "../state/PartialStateHolder.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {isTrue} from "../../util/AssertionUtils.js";

/**
 * @typedef {function(component: AbstractComponent): EventsBinder} EventsBinderProviderFn
 */
/**
 * @typedef {StateHolderOptions & ValueStateInitializerOptions & StateChangesHandlersInvokerOptions} AbstractComponentOptions
 * @property {string} elemIdOrJQuery
 * @property {string|number|boolean=} id
 * @property {SimpleContainerComponent=} parent
 * @property {PartialStateHolder=} stateHolder
 * @property {StateInitializer=} stateInitializer
 * @property {StateChangesHandlersInvoker=} stateChangesHandlersInvoker
 * @property {EventsBinder=} eventsBinder
 * @property {EventsBinderProviderFn=} eventsBinderProvider has priority against eventsBinder (usually is the opposite)
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
     * used as the GlobalConfig.DATA_OWNER
     *
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
     * @return {OptionalPartName} the part name inside parent's state (if any)
     */
    get partName() {
        return this.config[GlobalConfig.DATA_PART];
    }

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
     * updates the state by getting it from parent
     */
    replaceFromParent() {
        isTrue(this.partName != null,
            `partName is null! componentId = ${this.id}`);
        isTrue(this.parent != null,
            `parent is null! partName = ${this.partName}, componentId = ${this.id}`);
        this.replaceState(_.cloneDeep(this.parent.getPart(this.partName)));
    }

    /**
     * @return {SCT}
     */
    getState() {
        return this.stateHolder.stateCopy;
    }

    /**
     * @return {boolean}
     */
    stateIsNull() {
        return this.stateHolder.hasNull();
    }

    /**
     * @param {PartName} partName
     * @return {*}
     */
    getPart(partName) {
        return this.stateHolder?.getPart(partName);
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
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        this.doWithState(partialStateHolder =>
            partialStateHolder.replacePart(previousPartName, newPart, newPartName));
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}[]|SCT} parts
     */
    replaceParts(parts) {
        partsOf(parts).forEach(([key, value]) => this.replacePart(key, value));
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
        this.disconnect();
        this.replaceState();
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.eventsBinder?.detachEventHandlers();
    }

    /**
     * @param {StateChangesHandler} stateChangesHandlers
     */
    appendStateChangesHandlers(...stateChangesHandlers) {
        this.stateChangesHandlersInvoker.appendStateChangesHandlers(...stateChangesHandlers);
    }
}
