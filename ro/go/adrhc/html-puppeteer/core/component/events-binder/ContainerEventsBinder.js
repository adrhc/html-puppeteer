import EventsBinder from "./EventsBinder.js";
import GlobalConfig, {newGuestPartName} from "../../../util/GlobalConfig.js";
import {dataComponentIdSelectorOf, dataSelectorOf, idAttrSelectorOf} from "../../../util/SelectorUtils.js";

export default class ContainerEventsBinder extends EventsBinder {
    /**
     * Default event to bind to on children (for creating/removing a guest component).
     *
     * @type {string}
     */
    createRemoveEventName;

    /**
     * @param {AbstractComponent=} component
     */
    set component(component) {
        this._component = component;
        this.createRemoveEventName = component.config.guestsRemoveEvent ?? "click";
    }

    /**
     * @return {*} initial part state for the a new guest (aka child component)
     */
    get initialGuestDetails() {
        return this._component.config.itemProviderFn?.(this._component) ?? {};
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-owner="@root.owner" data-create-guest="click">
        this._attachChildrenEventsHandler("create-guest", () => {
            this._component.replacePart(newGuestPartName(), this.initialGuestDetails);
        });
        // <button data-owner="@root.owner" data-component-id="@root.componentId" data-remove-guest="click">
        this._attachChildrenEventsHandler("remove-guest", (ev) => {
            const guestId = $(ev.target).data(GlobalConfig.COMPONENT_ID);
            const guestPartName = Object.values((/** @type {SimpleContainerComponent} */ this._component).guests)
                .find(it => it.id === guestId).partName;
            this._component.replacePart(guestPartName);
        });
    }

    /**
     * @param {string} dataAttribName
     * @param {function} fn is the event handler
     * @param {boolean=} oneTimeOnly specify whether to invoke the event once or multiple times
     * @protected
     */
    _attachChildrenEventsHandler(dataAttribName, fn, oneTimeOnly) {
        const $parent = $(`${dataComponentIdSelectorOf(this._component.id)}, ${idAttrSelectorOf(this._component.id)}`);
        // removing previous handler (if any) set by another component
        $parent.off(this.createRemoveEventName, dataSelectorOf(dataAttribName));
        $parent.on(this.createRemoveEventName, dataSelectorOf(dataAttribName), fn);
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._$childrenHavingDataAttr("create-guest").off();
        this._$childrenHavingDataAttr("remove-guest").off(this.createRemoveEventName);
    }
}