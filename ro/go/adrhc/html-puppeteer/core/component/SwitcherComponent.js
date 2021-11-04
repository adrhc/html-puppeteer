import StaticContainerComponent from "./StaticContainerComponent.js";
import {USE_CSS} from "../view/SimpleView.js";

/**
 * @template SCT,SCP
 *
 * @typedef {Object} SCT
 * @property {OptionalPartName=} activePart
 * @property {SCP=} partValue
 */
/**
 * Notions:
 * "active name" or "active-component name" or "switched to name" represents the value specified by "data-part" on a child component.
 *
 * Usecase: active-component state is 1x part of SwitcherComponent state
 * When valueKey or valueKeyIsActiveName is set than SwitcherComponent.replacePart
 * will do a SwitcherComponent partial state change and possibly a complete
 * active-component state change, if the changed part name equals the
 * active-component name. One have to use SwitcherComponent.activeComponent
 * directly to do partial state changes on the active-component.
 *
 * Usecase: SwitcherComponent state is merged with active-component state
 * When valueKey is missing and valueKeyIsActiveName is false than
 * active-component's state is the SwitcherComponent's minus switchKey part.
 * Any partial state change on SwitcherComponent is a partial state change
 * on active-component too. A complete state change on SwitcherComponent
 * should translate into a complete state change on active-component too.
 *
 * @typedef {Object} SwitcherComponentOptions
 * @property {string=} switchKey is the partName storing the active-component name (i.e. the name equal to children's "data-part" in html)
 * @property {string=} valueKey is the partName where the active-component's value is stored by SwitcherComponent
 * @property {boolean=} valueKeyIsActiveName indicates that each active-component name is the switchKey's value; e.g. switcherKey="editable" means that replacePart("editable", newState) should set newState into both SwitcherComponent (partial replace) and the active-component (complete replace)
 */
/**
 * @extends {StaticContainerComponent}
 */
export default class SwitcherComponent extends StaticContainerComponent {
    /**
     * @return {AbstractComponent}
     */
    get activeComponent() {
        const activePart = this.activeName;
        return this.childrenComponents.getChildByPartName(activePart);
    }

    /**
     * @return {PartName}
     */
    get activeName() {
        return this.getPart("activeName", true);
    }

    /**
     * @param {StaticContainerComponentOptions} options
     * @param {ViewRemovalStrategy} options.childrenRemovalStrategy
     * @param {StaticContainerComponentOptions=} restOfOptions
     */
    constructor({childrenRemovalStrategy, ...restOfOptions}) {
        super({childrenRemovalStrategy: USE_CSS, ...restOfOptions});
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        super.replaceState(newState);
        this.childrenComponents.closeChildren();
        if (newState?.activePart != null) {
            this.switchTo(newState.activePart, newState.partValue);
        }
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP|PartName=} newPart
     * @param {PartName=} newPartName
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName = previousPartName, dontRecordChanges) {
        if (newPartName === "activeName") {
            this.switchTo(newPart);
        } else {
            this.switchTo(newPartName, newPart);
        }
    }

    /**
     * @param {SCT|PartName} partName
     * @param {SCP=} partValue
     */
    switchTo(partName, partValue) {
        const activeComponent = this.activeComponent;
        const activeState = activeComponent?.getStateCopy();
        const switchToComponent = this.childrenComponents.getChildByPartName(partName);
        activeComponent?.close();
        super.replacePart("activeName", partName);
        switchToComponent.render(partValue ?? activeState);
    }
}