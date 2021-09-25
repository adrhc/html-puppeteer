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
 * @property {ComponentsCollection} children
 * @property {PartName=} containerPart is the part managed directly by the container
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class SimpleContainerComponent extends AbstractComponent {
    /**
     * @type {ComponentsCollection}
     */
    children;
    /**
     * @type {PartName}
     */
    containerPart;

    /**
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.containerPart
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({containerPart, ...restOfOptions} = {}) {
        super(withDefaults(restOfOptions)
            .addComponentIllustratorProvider(simpleContainerIllustratorProvider)
            .options());
        this.containerPart = this.config.containerPart;
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.children = this.config.children ?? {};
        const fullState = _.isArray(newState) ? [] : {};
        fullState[this.containerPart] = newState[this.containerPart]
        super.replaceState(fullState);
        partsOf(newState).filter(([name]) => name !== this.containerPart).forEach(([name, value]) => this.replacePart(name, value));
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
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}} parts
     */
    replaceParts(parts) {
        if (parts[this.containerPart] != null) {
            console.log("Container part present in multi parts update; replacing entire state!");
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
                this.children[partStateChange.previousPartName].replaceState(partStateChange.newPart);
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
        this.children[partName] = createComponent($childElem, {parent: this}).render();
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     * @protected
     */
    _removeChild(partName) {
        if (!this.children[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.children[partName].close();
        delete this.children[partName];
        return true;
    }
}

function simpleContainerIllustratorProvider(componentId, componentIllustratorOptions) {
    return new SimpleContainerIllustrator({componentId, ...componentIllustratorOptions});
}
