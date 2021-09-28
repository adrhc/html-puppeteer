import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {$getPartElem, createComponent} from "../Puppeteer.js";
import ListContainerIllustrator from "../state-changes-handler/ListContainerIllustrator.js";

/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @typedef {AbstractComponentOptions} ListContainerComponentOptions
 * @property {ComponentsCollection} items
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class ListContainerComponent extends AbstractComponent {
    /**
     * @type {ComponentsCollection}
     */
    items;

    /**
     * @param {ListContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider(listContainerIllustratorProvider)
            .options());
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.items = this.config.items ?? {};
        // it's about whether the parent state is an Array or Object (i.e. Map)
        const roomLayout = this._roomStructureFor(newState);
        // using parent's view (only) to render the component's layout
        super.replaceState(roomLayout);
        // updating items (aka parts) state
        this.replaceParts(newState);
    }

    /**
     * @param {SCT=} newState new full/total state
     * @protected
     */
    _roomStructureFor(newState) {
        if (newState == null) {
            return newState;
        }
        return _.isArray(newState) ? [] : {};
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        const seatChanges = this.stateHolder.replacePart(previousPartName, newPart, newPartName);
        seatChanges.forEach(psc => {
            this._handleGuestChange(psc);
        });
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _handleGuestChange(partStateChange) {
        switch (partStateChange.changeType) {
            case CREATED:
                // the parent creates the guest's seat (aka DOM element)
                super._processStateChanges();
                // the guest component reads its state from the parent (i.e. this container component)
                this._placeGuest(partStateChange.newPartName);
                break;
            case REMOVED:
                this._removeGuest(partStateChange.previousPartName);
                // the parent removes the guest's seat (aka DOM element)
                super._processStateChanges();
                break;
            case REPLACED:
                // seat occupant changed its details; nothing should
                // happen to the room layout but we have to consume
                // the collected state changes
                super._processStateChanges();
                this.items[partStateChange.previousPartName].replaceState(partStateChange.newPart);
                break;
            case RELOCATED:
                this._removeGuest(partStateChange.previousPartName);
                // the parent removes the guest's previous seat (aka DOM element) and create a new one
                super._processStateChanges();
                // the guest component reads its state from the parent (i.e. this container component)
                this._placeGuest(partStateChange.newPartName);
                break;
            default:
                alertOrThrow(`Bad state change!\n${JSON.stringify(partStateChange)}`);
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _placeGuest(partName) {
        this.items[partName] = this._placeIntoSeat(partName);
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     * @protected
     */
    _placeIntoSeat(partName) {
        const component = this._createPartComponent(partName);
        isTrue(component != null, "[_placeIntoSeat] the seat should exist!")
        return component.render();
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     * @protected
     */
    _createPartComponent(partName) {
        const $childElem = $getPartElem(partName, this.config.elemIdOrJQuery);
        if (!$childElem.length) {
            console.warn(`Missing child element for ${partName}; could be parent's state though.`);
            return undefined;
        }
        return createComponent($childElem, {parent: this});
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     * @protected
     */
    _removeGuest(partName) {
        if (!this.items[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.items[partName].close();
        delete this.items[partName];
        return true;
    }
}

function listContainerIllustratorProvider(componentId, componentIllustratorOptions) {
    return new ListContainerIllustrator({componentId, ...componentIllustratorOptions});
}
