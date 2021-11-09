import EventsBinder from "./EventsBinder.js";
import {childIdOf} from "../../../util/GlobalConfig.js";
import {uniqueId} from "../../../util/StringUtils.js";
import {eventsBinder} from "../../../helper/events-handling/EventsBinderBuilder.js";

/**
 * @typedef {function(component: AbstractContainerComponent): *} ChildStateProviderFn
 */
/**
 * @typedef {Object} ContainerEventsBinderOptions
 * @property {string} createEvent
 * @property {string} removeEvent
 * @property {ChildStateProviderFn} childStateProviderFn
 */
export default class ContainerEventsBinder extends EventsBinder {
    /**
     * @type {ChildStateProviderFn}
     * @protected
     */
    childStateProviderFn;
    /**
     * @type {string}
     * @protected
     */
    createDataAttr;
    /**
     * @type {string}
     * @protected
     */
    createEvent;
    /**
     * @type {string}
     * @protected
     */
    removeDataAttr;
    /**
     * @type {string}
     * @protected
     */
    removeEvent;

    /**
     * If "get component" is not defined the "super" one will return undefined!
     *
     * @param {AbstractComponent=} component
     */
    set component(component) {
        this._component = component;
        this.createEvent = component.config.createEvent ?? this.createEvent;
        this.removeEvent = component.config.removeEvent ?? this.removeEvent;
        this.childStateProviderFn = component.config.childStateProviderFn ?? this.childStateProviderFn;
    }

    /**
     * @return {AbstractContainerComponent}
     */
    get containerComponent() {
        return /** @type {AbstractContainerComponent} */ this._component;
    }

    /**
     * @param {ChildStateProviderFn=} childStateProviderFn
     * @param {string=} createDataAttr
     * @param {string=} removeDataAttr
     * @param {string=} createEvent
     * @param {string=} removeEvent
     * @param {AbstractComponent=} component
     */
    constructor(childStateProviderFn, createDataAttr, removeDataAttr, createEvent, removeEvent, component) {
        super(component);
        this.childStateProviderFn = childStateProviderFn ?? (() => {});
        this.createDataAttr = createDataAttr ?? "create-child";
        this.createEvent = createEvent ?? "click";
        this.removeDataAttr = removeDataAttr ?? "remove-child";
        this.removeEvent = removeEvent ?? "click";
    }

    /**
     * attaches all necessary DOM event handlers
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            // <button data-owner="componentId" data-createDataAttr />
            .whenEvents(this.createEvent)
            .occurOnOwnedDataAttr(this.createDataAttr, this.componentId)
            .do(() => {
                this.containerComponent.replacePart(uniqueId(), this.childStateProviderFn(this.containerComponent));
            })
            .and()
            // <div component-id="componentId">
            //     <button data-child-id="childId" data-owner="componentId" data-removeDataAttr />
            // </div>
            .whenEvents(this.removeEvent)
            .occurOnComponent(this.containerComponent)
            .triggeredByOwnedDataAttr(this.removeDataAttr)
            .do((ev) => {
                const $elem = $(ev.target);
                const childId = childIdOf($elem);
                this.containerComponent.replacePartByChildId(childId);
            })
            .and()
            .buildDetachEventsHandlersFn();
    }
}