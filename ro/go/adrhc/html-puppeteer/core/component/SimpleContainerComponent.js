import {$getPartElem, createComponent} from "../Puppeteer.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {alertOrThrow} from "../../util/AssertionUtils.js";
import AbstractComponent from "./AbstractComponent.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";
import {partsOf} from "../state/PartialStateHolder.js";

/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @typedef {AbstractComponentOptions} SimpleContainerComponentOptions
 * @property {ComponentsCollection} guests
 * @property {PartName=} familyNames are the parts managed directly by the container or by other components not in guests room
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class SimpleContainerComponent extends AbstractComponent {
    /**
     * @type {ComponentsCollection}
     */
    family;
    /**
     * @type {PartName[]}
     */
    familyNames;
    /**
     * @type {ComponentsCollection}
     */
    guests;
    /**
     * @type {boolean}
     */
    noGuests;

    /**
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.familyNames
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({familyNames, ...restOfOptions} = {}) {
        super(withDefaults(restOfOptions)
            .addComponentIllustratorProvider(simpleContainerIllustratorProvider)
            .options());
        this.familyNames = this.config.familyNames?.split(",") ?? [];
        this.noGuests = this.config.noGuests ?? false;
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.guests = this.config.guests ?? {};
        this.family = this.config.family ?? {};
        const familyState = this._familyStateFrom(newState);
        // replacing the parent's content using its view only
        // this should create guests seats
        super.replaceState(familyState);
        // scanning for family members and render them
        this._createFamilyComponents(familyState);
        // scanning for family members and render them
        this._createGuestComponents(newState);
    }

    /**
     * @param {SCT} newState
     * @protected
     */
    _createGuestComponents(newState) {
        if (this.noGuests) {
            return;
        }
        partsOf(newState).filter(([name]) => !this.familyNames.includes(name))
            .forEach(([name, value]) => this.replacePart(name, value, name));
    }

    /**
     * @param {SCT} familyState
     * @protected
     */
    _createFamilyComponents(familyState) {
        Object.entries(familyState).forEach(([name, value]) => this._createAndRenderFamilyMember(name, value));
    }

    /**
     * @param {SCT=} newState new full/total state
     * @protected
     */
    _familyStateFrom(newState) {
        const familyState = _.isArray(newState) ? [] : {};
        if (this.noGuests) {
            partsOf(newState).forEach(([name, value]) => familyState[name] = value);
        } else {
            this.familyNames.forEach(name => familyState[name] = newState[name]);
        }
        return familyState;
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        const stateChanges = this.stateHolder.replacePart(previousPartName, newPart, newPartName);
        stateChanges.forEach(psc => this._processStateChange(psc));
    }

    /**
     * @param {{[name: PartName]: SCP}[]} parts
     * @protected
     */
    _isAnyFamilyNameIncludedIn(parts) {
        return partsOf(parts).find(([name]) => this.familyNames.includes(name)) != null;
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}[]} parts
     */
    replaceParts(parts) {
        if (this.noGuests || this._isAnyFamilyNameIncludedIn(parts)) {
            console.log("Family names present in multi parts update! merging missing guests then replacing the entire state");
            this.noGuests || this._mergeGuestsInto(parts);
            this.replaceState(parts);
        }
        super.replaceParts(parts);
    }

    /**
     * @param {{[name: PartName]: SCP}[]} parts
     * @protected
     */
    _mergeGuestsInto(parts) {
        Object.entries(this.guests)
            .filter(([name]) => parts[name] == null)
            .forEach(([name, component]) => parts[name] = component.getState());
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _processStateChange(partStateChange) {
        switch (partStateChange.changeType) {
            case CREATED:
                // the parent should create the DOM element for the child
                this._processStateChanges();
                this._createAndRenderGuest(partStateChange.newPartName);
                break;
            case REMOVED:
                this._removeChild(partStateChange.previousPartName);
                // the parent should remove the child's DOM element
                this._processStateChanges();
                break;
            case REPLACED:
                this._processStateChanges();
                this.guests[partStateChange.previousPartName].replaceState(partStateChange.newPart);
                break;
            case RELOCATED:
                this._removeChild(partStateChange.previousPartName);
                // the parent should remove child's previous DOM element and create the new one
                this._processStateChanges();
                // the child will take its state from the parent (i.e. this component)
                this._createAndRenderGuest(partStateChange.newPartName);
                break;
            default:
                alertOrThrow(`Bad state change!\n${JSON.stringify(partStateChange)}`);
        }
    }

    /**
     * @param {PartName} partName
     * @param {SCP} partValue
     * @protected
     */
    _createAndRenderFamilyMember(partName, partValue) {
        const component = this._createContainedComponent(partName);
        if (!component) {
            return;
        }
        this.family[partName] = component.render(partValue);
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createAndRenderGuest(partName) {
        const component = this._createContainedComponent(partName);
        if (!component) {
            return;
        }
        this.guests[partName] = component.render();
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     * @protected
     */
    _createContainedComponent(partName) {
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
    _removeChild(partName) {
        if (!this.guests[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.guests[partName].close();
        delete this.guests[partName];
        return true;
    }
}

function simpleContainerIllustratorProvider(componentId, componentIllustratorOptions) {
    return new SimpleContainerIllustrator({componentId, ...componentIllustratorOptions});
}
