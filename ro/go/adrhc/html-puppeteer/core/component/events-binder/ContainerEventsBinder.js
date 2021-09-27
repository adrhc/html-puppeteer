import EventsBinder from "./EventsBinder.js";
import {guestPartOf, newGuestPartName} from "../../../util/GlobalConfig.js";

export default class ContainerEventsBinder extends EventsBinder {
    /**
     * @return {*} initial part state for the a new guest (aka child component)
     */
    get initialGuestDetails() {
        return _.clone(this.component.config.initialGuestDetails) ?? {};
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        // <button data-owner="componentId" data-create-guest="click">
        this._attachHandlerByDataAttrib("create-guest", () => {
            this.component.replacePart(newGuestPartName(), this.initialGuestDetails);
        });
        // <button data-owner="componentId" data-remove-guest="click" data-guest-part="cats">
        this._attachHandlerByDataAttrib("remove-guest", (ev) => {
            const guestPart = guestPartOf(ev.target());
            this.component.replacePart(guestPart);
        }, true);
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        this._$ownedElem("create-guest").off();
        this._$ownedElem("remove-guest").off();
    }
}