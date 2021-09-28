import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import {alertOrThrow, isTrue} from "../../util/AssertionUtils.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../state/change/StateChangeTypes.js";
import {$getPartElem, createComponent} from "../Puppeteer.js";
import ListContainerIllustrator from "../state-changes-handler/ListContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";

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
            .withEventsBinders(new ContainerEventsBinder())
            .options());
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getItemById(itemId) {
        return Object.values(this.items).find(it => it.id === itemId);
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
            this._handleItemChange(psc);
        });
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     * @protected
     */
    _handleItemChange(partStateChange) {
        switch (partStateChange.changeType) {
            case CREATED:
                // the parent creates the item's shell (aka DOM element)
                super._processStateChanges();
                // the item component reads its state from the parent (i.e. this container component)
                this._createItem(partStateChange.newPartName);
                break;
            case REMOVED:
                this._removeItem(partStateChange.previousPartName);
                // the parent removes the item's shell (aka DOM element)
                super._processStateChanges();
                break;
            case REPLACED:
                // shell occupant changed its details; nothing should
                // happen to the room layout but we have to consume
                // the collected state changes
                super._processStateChanges();
                this._replaceItemState(partStateChange.previousPartName, partStateChange.newPart);
                break;
            case RELOCATED:
                this._removeItem(partStateChange.previousPartName);
                // the parent removes the item's previous shell (aka DOM element) and create a new one
                super._processStateChanges();
                // the item component reads its state from the parent (i.e. this container component)
                this._createItem(partStateChange.newPartName);
                break;
            default:
                alertOrThrow(`Bad state change!\n${JSON.stringify(partStateChange)}`);
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createItem(partName) {
        const $shell = $getPartElem(partName, this.config.elemIdOrJQuery);
        if (!$shell.length) {
            console.warn(`Missing child element for ${partName}; could be parent's state though.`);
            return undefined;
        }
        // at this point the item component's id is available as data-GlobalConfig.COMPONENT_ID on $seat
        const component = createComponent($shell, {parent: this});
        isTrue(component != null, "[_createItem] the child's shell should exist!")
        this.items[partName] = component.render();
    }

    /**
     * @param {PartName} itemName
     * @param {SCP} newStateValue
     * @protected
     */
    _replaceItemState(itemName, newStateValue) {
        this.items[itemName].replaceState(newStateValue);
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     * @protected
     */
    _removeItem(partName) {
        if (!this.items[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.items[partName].close();
        delete this.items[partName];
        return true;
    }
}

/**
 * @param {string} componentId
 * @param {ListContainerIllustratorOptions} componentConfig
 * @return {ListContainerIllustrator}
 */
function listContainerIllustratorProvider(componentId, componentConfig) {
    return new ListContainerIllustrator({componentId, ...componentConfig});
}
