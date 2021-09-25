import {$getChildElem, createComponent} from "../Puppeteer.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {alertOrThrow} from "../../util/AssertionUtils.js";
import AbstractComponent from "./AbstractComponent.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";

/**
 * @typedef {{[key: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @typedef {AbstractComponentOptions} SimpleContainerComponentOptions
 * @property {ComponentsCollection} children
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
     * @param {SimpleContainerComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {SimpleContainerComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super(withDefaults(restOfOptions)
            .addComponentIllustratorProvider(simpleContainerIllustratorProvider)
            .options());
        this._initializeChildren();
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        super.render(value);
        this._createChildren();
        return this;
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        super.replaceState(newState);
        this._createChildren();
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
        Object.entries(parts).forEach(([key, value]) => this.replacePart(key, value));
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
     * Automatically detect, create and render children.
     *
     * @protected
     */
    _createChildren() {
        this._initializeChildren();
        this.stateHolder.getParts()
            .filter(([, value]) => value != null)
            .forEach(([name]) => {
                this._createChild(name);
            });
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

    /**
     * @protected
     */
    _initializeChildren() {
        this.children = this.config.children ?? {};
    }
}

function simpleContainerIllustratorProvider(componentId, componentIllustratorOptions) {
    return new SimpleContainerIllustrator({componentId, ...componentIllustratorOptions});
}