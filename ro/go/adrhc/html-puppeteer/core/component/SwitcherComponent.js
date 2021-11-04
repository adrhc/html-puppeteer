import {USE_CSS} from "../view/SimpleView.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

/**
 * @typedef {AbstractContainerComponent} SwitcherComponentOptions
 * @property {string=} activeNameKey is the partName storing the active-component name (i.e. the name equal to children's "data-part" in html)
 * @property {string=} activeValueKey is the partName where the active-component's value is stored by SwitcherComponent
 * @property {boolean=} [valueKeyIsActiveName=true] indicates that each active-component name is the activeNameKey's value; e.g. activeNameKey="editable" means that replacePart("editable", newState) should set newState into both SwitcherComponent (partial replace) and the active-component (complete replace)
 */
/**
 * @template SCT,SCP
 *
 * @typedef {Object} SCT
 * @property {OptionalPartName=} activeName
 * @property {SCP=} partValue
 */
/**
 * Notions:
 * "active name" or "active-component name" or "switched to name" represents the value specified by "data-part" on a child component.
 *
 * Usecase: active-component state is 1x part of SwitcherComponent state
 * When activeValueKey or valueKeyIsActiveName is set than SwitcherComponent.replacePart
 * will do a SwitcherComponent partial state change and possibly a complete
 * active-component state change, if the changed part name equals the
 * active-component name. One have to use SwitcherComponent.activeComponent
 * directly to do partial state changes on the active-component.
 *
 * Usecase: SwitcherComponent state is merged with active-component state
 * When activeValueKey is missing and valueKeyIsActiveName is false than
 * active-component's state is the SwitcherComponent's minus activeNameKey part.
 * Any partial state change on SwitcherComponent is a partial state change
 * on active-component too. A complete state change on SwitcherComponent
 * should translate into a complete state change on active-component too.
 */
export default class SwitcherComponent extends AbstractContainerComponent {
    /**
     * @type {string}
     */
    activeNameKey;
    /**
     * @type {string}
     */
    activeValueKey;
    /**
     * @type {boolean}
     */
    valueKeyIsActiveName;

    /**
     * @return {AbstractComponent}
     */
    get activeComponent() {
        const activeName = this.activeName;
        return this.childrenComponents.getChildByPartName(activeName);
    }

    /**
     * @return {PartName}
     */
    get activeName() {
        return this.getPart(this.activeNameKey, true);
    }

    /**
     * @param {SwitcherComponentOptions} options
     */
    constructor(options) {
        super({childrenRemovalStrategy: USE_CSS, ...options, ignoreShellTemplateOptions: true});
        this.activeNameKey = this.config.activeNameKey ?? GlobalConfig.ACTIVE_NAME_KEY;
        this.activeValueKey = this.config.activeValueKey;
        this.valueKeyIsActiveName = this.config.valueKeyIsActiveName ?? true;
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.childrenComponents.disconnectAndRemoveChildren();
        super.replaceState(newState);
        this.childrenComponents.createChildrenForExistingShells();
        this.childrenComponents.closeChildren();
        this._switchUsingCurrentState();
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP|PartName=} newPart
     * @param {PartName=} [newPartName=previousPartName] indicates the new active name
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName = previousPartName, dontRecordChanges) {
        // check for active name change
        if (newPartName === this.activeNameKey) {
            // active name changed while the value is the previous one
            this._switchTo(newPart, this.activeComponent?.getMutableState());
            return;
        }
        super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        // active name not changed
        if (this.valueKeyIsActiveName) {
            // active value is the state part pointed by the active name, e.g. switcherState["editable"]
            if (newPartName === this.activeName) {
                // only the active value changed while the active name remains untouched
                this.activeComponent.replaceState(newPart);
            } else {
                // both active value and name changed
                this._switchTo(newPartName, newPart);
            }
        } else if (this.activeValueKey != null) {
            // active value is a fixed state part, the one specified by activeValueKey
            if (newPartName === this.activeValueKey) {
                // only the active value changed while the active name remains untouched
                this.activeComponent.replaceState(newPart);
            } else {
                // both active value and name changed
                this._switchTo(newPartName, newPart);
            }
        } else {
            // active value is blended into SwitcherComponent state
            // replacing partially only if the child is capable to perform partial changes (aka: has replacePart method)
            this.activeComponent?.replacePart?.(previousPartName, newPart, newPartName, dontRecordChanges);
        }
    }

    /**
     * @protected
     */
    _switchUsingCurrentState() {
        const stateCopy = this.getStateCopy();
        const activeName = stateCopy?.[this.activeNameKey];
        this._switchTo(activeName, this._getActiveValueFromState(stateCopy));
    }

    /**
     * @param {PartName} newActiveName
     * @param {*} newActiveValue
     */
    _switchTo(newActiveName, newActiveValue) {
        this.activeComponent?.close();
        const switchToComponent = this.childrenComponents.getChildByPartName(newActiveName);
        super.replacePart(this.activeNameKey, newActiveName);
        switchToComponent?.render(newActiveValue);
    }

    /**
     * @param {SCT} completeSwitcherState
     * @return {*}
     * @protected
     */
    _getActiveValueFromState(completeSwitcherState) {
        if (this.valueKeyIsActiveName) {
            // active value is the state part pointed by the active name
            const activeName = completeSwitcherState?.[this.activeNameKey];
            return activeName == null ? undefined : completeSwitcherState[activeName];
        } else if (this.activeValueKey != null) {
            // active value is a fixed state part, the one specified by activeValueKey
            return completeSwitcherState?.[this.activeValueKey];
        }
        // active value is blended into SwitcherComponent state
        // all but SwitcherComponent's specific state-parts (i.e. activeNameKey) represent the active value
        return _.omit(completeSwitcherState, this.activeNameKey);
    }
}