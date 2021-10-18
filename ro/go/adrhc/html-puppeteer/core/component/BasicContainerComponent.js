import AbstractComponent from "./AbstractComponent.js";
import {partsOf} from "../state/PartialStateHolder.js";
import ChildrenComponents from "./composition/ChildrenComponents.js";
import {isTrue} from "../../util/AssertionUtils.js";
import ChildrenShells from "../view/ChildrenShells.js";
import ChildrenShellFinder from "../view/ChildrenShellFinder.js";

/**
 * @typedef {AbstractComponentOptions & ContainerEventsBinderOptions & ChildrenComponentsOptions & SimpleContainerIllustratorOptions} BasicContainerComponentOptions
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
     * @type {boolean}
     */
    newChildrenGoLast;

    /**
     * @param {BasicContainerComponentOptions} options
     * @param {boolean=} options.dontRenderChildren
     * @param {Bag=} options.childrenCreationCommonOptions
     * @param {AbstractComponentOptions=} restOfOptions
     */
    constructor({dontRenderChildren, childrenCreationCommonOptions, ...restOfOptions}) {
        super(restOfOptions);
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
            .filter(([key]) => this.childrenComponents.getChildByPartName(key) == null)
            .filter(([key]) => !this.stateHolder.hasEmptyPart(key))
            .forEach(([key]) => this._createOrUpdateChild(key));
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePart(previousPartName, newPart, newPartName) {
        super.replacePart(previousPartName, newPart, newPartName);
        const partName = newPartName ?? previousPartName;
        if (this.stateHolder.hasEmptyPart(partName)) {
            this._removeChild(partName);
        } else {
            this._createOrUpdateChild(partName);
        }
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _createOrUpdateChild(partName) {
        const $shell = this.childrenShells.getOrCreateShell(partName);
        isTrue($shell != null,
            `$shell is null for part named ${partName}!`)
        this.childrenComponents.createOrUpdateChild(partName, $shell);
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
}