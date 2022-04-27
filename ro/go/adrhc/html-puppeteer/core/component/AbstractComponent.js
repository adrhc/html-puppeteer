import {StateProcessor} from "../state-processor/StateProcessor.js";
import DefaultComponentConfigurator from "./configurator/DefaultComponentConfigurator.js";
import {applyExtraConfigurators} from "./configurator/ComponentConfigurator.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {isTrue} from "../../util/AssertionUtils.js";
import {renderOrConfigElemOf} from "../view/SimpleView.js";

/**
 * @typedef {StateHolderOptions & ValueStateInitializerOptions & StateChangesHandlersInvokerOptions} AbstractComponentOptions
 * @property {ElemIdOrJQuery} elemIdOrJQuery
 * @property {string|number|boolean=} id
 * @property {AbstractContainerComponent=} parent
 * @property {StateHolder=} stateHolder
 * @property {StateHolderProviderFn=} stateHolderProvider
 * @property {StateInitializer=} stateInitializer
 * @property {StateChangesHandlersInvoker=} stateChangesHandlersInvoker
 * @property {EventsBinderProviderFn[]=} eventsBinderProviders
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
export default class AbstractComponent {
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
     * specify whether eventsBinder?.attachEventHandlers() was called or not
     * @type {boolean}
     */
    eventHandlersBound;
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
     * @type {AbstractContainerComponent}
     */
    parent;
    /**
     * @type {StateInitializer}
     */
    stateInitializer;
    /**
     * @type {StateProcessor}
     */
    stateProcessor;

    /**
     * @return {jQuery<HTMLElement>}
     */
    get $renderElem() {
        return renderOrConfigElemOf(this.config);
    }

    /**
     * @return {OptionalPartName} the part name inside parent's state (if any)
     */
    get partName() {
        return this.config[GlobalConfig.DATA_PART];
    }

    /**
     * @return {StateHolder}
     */
    get stateHolder() {
        return this.stateProcessor.stateHolder;
    }

    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options) {
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
        if (this.partName === "") {
            this.replaceState(this.parent.getStateCopy());
        } else {
            this.replaceState(this.parent.getPart(this.partName));
        }
    }

    /**
     * @return {SCT}
     */
    getMutableState() {
        return this.stateProcessor.getMutableState();
    }

    /**
     * @return {SCT}
     */
    getStateCopy() {
        return this.stateProcessor.getStateCopy();
    }

    /**
     * @return {boolean}
     */
    isStateEmpty() {
        return this.stateProcessor.isStateEmpty();
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
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        this._initializeState(value);
        this._attachEventHandlers();
        return this;
    }

    /**
     * @protected
     */
    _attachEventHandlers() {
        if (this.eventHandlersBound) {
            console.warn(`[render] event handlers already bound! id = ${this.id}, partName = ${this.partName}, parentId = ${this.parent?.id}`)
        } else {
            this.eventsBinder?.attachEventHandlers();
            this.eventHandlersBound = true;
        }
    }

    /**
     * set state to undefined
     */
    close() {
        this.disconnect();
        this.replaceState();
        this.rendered = false;
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.eventsBinder?.detachEventHandlers();
        this.eventHandlersBound = false;
    }

    /**
     * @param {StateChangesHandler} stateChangesHandlers
     */
    appendStateChangesHandlers(...stateChangesHandlers) {
        super.appendStateChangesHandlers(...stateChangesHandlers);
    }

    /**
     * Offers the state for manipulation then execute the state changes handlers.
     *
     * @param {StateUpdaterFn} stateUpdaterFn
     */
    doWithState(stateUpdaterFn) {
        this.stateProcessor.doWithState(stateUpdaterFn);
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
}
