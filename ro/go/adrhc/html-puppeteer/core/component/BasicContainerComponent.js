import PartialStateHolder, {partsOf} from "../state/PartialStateHolder.js";
import ChildrenComponents from "./composition/ChildrenComponents.js";
import {isTrue} from "../../util/AssertionUtils.js";
import ChildrenShells from "../view/ChildrenShells.js";
import ChildrenShellFinder from "../view/ChildrenShellFinder.js";
import {stateIsEmpty} from "../state/StateHolder.js";
import AbstractComponent from "./AbstractComponent.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import ComponentIllustrator from "../state-changes-handler/ComponentIllustrator.js";

/**
 * @typedef {AbstractComponentOptions & ContainerEventsBinderOptions & ChildrenComponentsOptions} BasicContainerComponentOptions
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class BasicContainerComponent extends AbstractComponent {
    /**
     * @type {ChildrenComponents}
     */
    childrenComponents;
    /**
     * @type {ChildrenShells}
     */
    childrenShells;

    /**
     * @return {boolean}
     */
    get newChildrenGoLast() {
        return this.config.newChildrenGoLast;
    }

    /**
     * @return {PartialStateHolder}
     */
    get partialStateHolder() {
        return /** @type {PartialStateHolder} */ this.stateHolder;
    }

    /**
     * @param {BasicContainerComponentOptions} options
     * @param {ComponentIllustrator=} options.componentIllustrator
     * @param {boolean=} options.dontRenderChildren
     * @param {Bag=} options.childrenCreationCommonOptions
     * @param {AbstractComponentOptions=} restOfOptions
     */
    constructor({componentIllustrator, dontRenderChildren, childrenCreationCommonOptions, ...restOfOptions}) {
        super(withDefaults(restOfOptions)
            .withStateHolderProvider(c => new PartialStateHolder(c.config))
            .addStateChangesHandlerProvider((component) =>
                (componentIllustrator ?? new ComponentIllustrator(component.config)))
            .addEventsBinders(new ContainerEventsBinder())
            .options());
        const childrenShellFinder = new ChildrenShellFinder(this.config.elemIdOrJQuery);
        this.childrenShells = new ChildrenShells({componentId: this.id, childrenShellFinder, ...this.config});
        this.childrenComponents = new ChildrenComponents({
            parent: this,
            childrenShellFinder,
            dontRenderChildren,
            childrenCreationCommonOptions
        });
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        // this must happen before container redraw to give a
        // chance to the children to unbind their event handlers;
        // their view will be automatically destroyed when
        // the parent redraws itself
        this.childrenComponents.disconnectAndRemoveChildren();
        // the parent redraws itself
        super.replaceState(newState);
        // create children for existing (static) shells
        this.childrenComponents.createChildrenForExistingShells();
        // create shell and children for missing (dynamic) shells skipping existing children (having static shells)
        partsOf(newState, !this.newChildrenGoLast)
            .filter(([key]) => !this.partialStateHolder.hasEmptyPart(key))
            .filter(([key]) => this.childrenComponents.getChildByPartName(key) == null)
            .forEach(([key]) => this._createOrUpdateChild(key));
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName, dontRecordChanges) {
        const partName = newPartName ?? previousPartName;
        if (stateIsEmpty(newPart)) {
            this._removeChild(partName);
            this._replacePartImpl(previousPartName, newPart, newPartName, dontRecordChanges);
        } else {
            this._replacePartImpl(previousPartName, newPart, newPartName, dontRecordChanges);
            this._createOrUpdateChild(partName);
        }
    }

    /**
     * @param {PartName} partName
     * @param {boolean=} dontClone
     * @return {*}
     */
    getPart(partName, dontClone) {
        return this.partialStateHolder.getPart(partName, dontClone);
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}[]|SCT} parts
     */
    replaceParts(parts) {
        partsOf(parts).forEach(([key, value]) => this.replacePart(key, value));
    }

    /**
     * @param {string} childId
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePartByChildId(childId, newPart, newPartName) {
        const partName = this.childrenComponents.getChildById(childId).partName;
        this.replacePart(partName, newPart, newPartName);
    }

    /**
     * set state to undefined
     */
    close() {
        this.childrenComponents.closeAndRemoveChildren();
        super.close();
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.childrenComponents.disconnectAndRemoveChildren();
        super.disconnect();
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChild(partName) {
        const $shell = this.childrenShells.getOrCreateShell(partName);
        isTrue($shell != null,
            `$shell is null for part named ${partName}!`)
        this.childrenComponents.createOrUpdateChild($shell);
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _removeChild(partName) {
        this.childrenComponents.closeAndRemoveChild(partName);
        // the shell might actually be removed already by the closing child
        this.childrenShells.removeShell(partName);
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     * @param {boolean=} dontRecordChanges
     * @protected
     */
    _replacePartImpl(previousPartName, newPart, newPartName, dontRecordChanges) {
        this.doWithState(partialStateHolder =>
            partialStateHolder.replacePart(previousPartName, newPart, newPartName, dontRecordChanges));
    }
}