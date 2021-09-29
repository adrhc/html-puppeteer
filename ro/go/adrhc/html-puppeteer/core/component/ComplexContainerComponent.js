import {createComponent} from "../Puppeteer.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {alertOrThrow, isFalse, isTrue} from "../../util/AssertionUtils.js";
import AbstractComponent from "./AbstractComponent.js";
import ComplexContainerIllustrator from "../state-changes-handler/ComplexContainerIllustrator.js";
import {partsOf} from "../state/PartialStateHolder.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {dataPartSelectorOf} from "../../util/SelectorUtils.js";

/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @typedef {AbstractComponentOptions} ComplexContainerComponentOptions
 * @property {ComponentsCollection} guests
 * @property {PartName=} familyNames are the parts managed directly by the container or by other components not in guests room
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class ComplexContainerComponent extends AbstractComponent {
    /**
     * @type {ComponentsCollection}
     */
    family;
    /**
     * @type {PartName[]}
     */
    familyNames;
    /**
     * @type {PartName[]}
     */
    familyOrStandingNames;
    /**
     * @type {ComponentsCollection}
     */
    guests;
    /**
     * @type {boolean}
     */
    noGuests;
    /**
     * @type {PartName[]}
     */
    roomParts;

    /**
     * @param {ComplexContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider(simpleContainerIllustratorProvider)
            .options());
        this.noGuests = this.config.noGuests ?? false;
        this.roomParts = this.config.roomParts?.split(",") ?? [];
        this.familyNames = this.config.familyNames?.split(",") ?? [];
        this.familyOrStandingNames = [...this.familyNames, ...this.roomParts];
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.guests = this.config.guests ?? {};
        this.family = this.config.family ?? {};
        this.familyNames = this.config.familyNames?.split(",") ?? this._findFamilyNames(newState);
        this.familyOrStandingNames = [...this.familyNames, ...this.roomParts];
        const roomLayout = this._roomLayoutFor(newState);
        // using parent's view only to render roomLayout; it'll create the family shells
        super.replaceState(roomLayout);
        // placing family members (shells are already created)
        //
        // Because only shells are created but not yet occupied
        // there's not possible to find a data-part inside a
        // shell (aka inside a container child component).
        this._placeFamilyMembers();
        // updating guests list (aka parts)
        //
        // Some guests might find a shell (i.e. data-part)
        // inside a family member ("container") shell. In
        // such situations the usage of data-guests is
        // mandatory.
        this._updateGuestsDetails(newState);
    }

    /**
     * @param {SCT} newState
     * @return {string[]}
     * @protected
     */
    _findFamilyNames(newState) {
        if (this.noGuests) {
            // all not standing are family
            return partsOf(newState).map(([name]) => name)
                .filter(name => !this.roomParts.includes(name));
        } else {
            // all parts are guests or standing
            return [];
        }
    }

    /**
     * @param {SCT} newState
     * @protected
     */
    _updateGuestsDetails(newState) {
        partsOf(newState)
            .filter(([name]) => !this.familyNames.includes(name) && !this.roomParts.includes(name))
            .forEach(([name, value]) => this.replacePart(name, value, name));
    }

    /**
     * @protected
     */
    _placeFamilyMembers() {
        this.familyNames.forEach(name => this._placeFamilyMember(name));
    }

    /**
     * @param {SCT=} newState new full/total state
     * @protected
     */
    _roomLayoutFor(newState) {
        if (newState == null) {
            return newState;
        }
        const roomLayout = _.isArray(newState) ? [] : {};
        this.familyOrStandingNames.forEach(name => roomLayout[name] = newState[name]);
        return roomLayout;
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        const shellChanges = this.stateHolder.replacePart(previousPartName, newPart, newPartName);
        shellChanges.forEach(psc => {
            isFalse(psc.changeType === RELOCATED &&
                (this.familyOrStandingNames.includes(psc.previousPartName)
                    || this.familyOrStandingNames.includes(psc.newPartName)),
                "[ComplexContainerComponent.replacePart] Can't relocate a family or standing member!");
            if (psc.changeType !== RELOCATED) {
                if (this.familyNames.includes(psc.previousPartName ?? psc.newPartName)) {
                    this._handleFamilyChange(psc);
                    return;
                } else if (this.roomParts.includes(psc.previousPartName ?? psc.newPartName)) {
                    this._handleStandingChange(psc);
                    return;
                }
            }
            this._handleGuestChange(psc);
        });
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _handleFamilyChange(partStateChange) {
        switch (partStateChange.changeType) {
            case CREATED:
                // the parent creates the guest's shell (aka DOM element)
                super._processStateChanges();
                // the family component reads its state from the parent (i.e. this container component)
                this._placeFamilyMember(partStateChange.newPartName);
                break;
            case REMOVED:
                this.family[partStateChange.previousPartName].replaceState();
                // the parent removes the guest's shell (aka DOM element)
                super._processStateChanges();
                break;
            case REPLACED:
                // shell occupant changed its details; nothing should
                // happen to the room layout but we have to consume
                // the collected state changes
                super._processStateChanges();
                this.family[partStateChange.previousPartName].replaceState(partStateChange.newPart);
                break;
            default:
                alertOrThrow(`Bad state change!\n${JSON.stringify(partStateChange)}`);
        }
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _handleStandingChange(partStateChange) {
        // would try to find the related (missing) shell (i.e. data-part)
        this.stateHolder.cancelAllStateChanges();
        // todo: should try to sync 1th the state with the view?
        const newState = _.cloneDeep(this.stateHolder.currentState ?? {});
        // forcing full redraw
        this.replaceState(newState);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _handleGuestChange(partStateChange) {
        switch (partStateChange.changeType) {
            case CREATED:
                // the parent creates the guest's shell (aka DOM element)
                super._processStateChanges();
                // the guest component reads its state from the parent (i.e. this container component)
                this._placeGuest(partStateChange.newPartName);
                break;
            case REMOVED:
                this._removeGuest(partStateChange.previousPartName);
                // the parent removes the guest's shell (aka DOM element)
                super._processStateChanges();
                break;
            case REPLACED:
                // shell occupant changed its details; nothing should
                // happen to the room layout but we have to consume
                // the collected state changes
                super._processStateChanges();
                this.guests[partStateChange.previousPartName].replaceState(partStateChange.newPart);
                break;
            case RELOCATED:
                this._removeGuest(partStateChange.previousPartName);
                // the parent removes the guest's previous shell (aka DOM element) and create a new one
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
    _placeFamilyMember(partName) {
        if (this.closed) {
            return;
        }
        this.family[partName] = this._placeIntoSeat(partName);
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _placeGuest(partName) {
        this.guests[partName] = this._placeIntoSeat(partName);
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     * @protected
     */
    _placeIntoSeat(partName) {
        const component = this._createPartComponent(partName);
        isTrue(component != null, "[_placeFamilyMember] the family shell should exist!")
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
        if (!this.guests[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.guests[partName].close();
        delete this.guests[partName];
        return true;
    }
}

function $getPartElem(partName, parentElemIdOrJQuery) {
    return jQueryOf(parentElemIdOrJQuery).children(dataPartSelectorOf(partName));
}

function simpleContainerIllustratorProvider(component) {
    return new ComplexContainerIllustrator({componentId: component.id, ...component.config});
}
