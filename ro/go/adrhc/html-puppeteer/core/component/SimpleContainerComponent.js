import {$getChildElem, createComponent} from "../Puppeteer.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {alertOrThrow} from "../../util/AssertionUtils.js";
import AbstractComponent from "./AbstractComponent.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";
import {partsOf} from "../state/PartialStateHolder.js";

/**
 * @typedef {{[key: string]: AbstractComponent}} ComponentsCollection
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
     * @type {PartName[]}
     */
    familyNames;
    /**
     * @type {ComponentsCollection}
     */
    guests;

    /**
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.familyNames
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({familyNames, ...restOfOptions} = {}) {
        super(withDefaults(restOfOptions)
            .addComponentIllustratorProvider(simpleContainerIllustratorProvider)
            .options());
        this.familyNames = this.config.familyNames?.split(",");
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.guests = this.config.guests ?? {};
        const fullState = this._familyStateFrom(newState);
        super.replaceState(fullState);
        partsOf(newState).filter(([name]) => name !== this.familyNames).forEach(([name, value]) => this.replacePart(name, value));
    }

    /**
     * @param {SCT=} newState new full/total state
     * @protected
     */
    _familyStateFrom(newState) {
        const familyState = _.isArray(newState) ? [] : {};
        this.familyNames.forEach(name => familyState[name] = newState[name]);
        return familyState;
    }

    /**
     * Replaces a component's state part.
     *
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
        if (this._isAnyFamilyNameIncludedIn(parts)) {
            console.log("Family names present in multi parts update; replacing entire state!");
            this.replaceState(parts);
        }
        super.replaceParts(parts);
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
                this._createChild(partStateChange.newPartName);
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
                this._createChild(partStateChange.newPartName);
                break;
            default:
                alertOrThrow(`Bad state change!\n${JSON.stringify(partStateChange)}`);
        }
    }

    /**
     * Create and render a child.
     *
     * @param {PartName} partName
     * @protected
     */
    _createChild(partName) {
        const $childElem = $getChildElem(partName, this.config.elemIdOrJQuery);
        if (!$childElem.length) {
            console.warn(`Missing child element for ${partName}; could be parent's state though.`);
            return;
        }
        this.guests[partName] = createComponent($childElem, {parent: this}).render();
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
