import {USE_CSS} from "../view/SimpleView.js";
import GlobalConfig, {activeNameOf} from "../../util/GlobalConfig.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";
import {isTrue} from "../../util/AssertionUtils.js";

/**
 * @typedef {AbstractContainerComponentOptions} SwitcherComponentOptions
 * @property {string=} activeNameKey is the partName storing the active-component name (i.e. the name equal to children's "data-active-name" in html)
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
        const activeComponents = this.childrenCollection.filter(c => this.activeName === activeNameOf(c));
        isTrue(activeComponents.length <= 1);
        return activeComponents[0];
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
        super({
            childrenRemovalStrategy: USE_CSS,
            ignoreShellTemplateOptions: true,
            dontRenderChildren: true, ...options
        });
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
        this.childrenCollection.disconnectAndRemoveChildren();
        super.replaceState(_.omit(newState, this.activeNameKey));
        this.childrenCollection.createChildrenForAllShells();
        this.childrenCollection.closeChildren();
        this.switchTo(newState[this.activeNameKey], this._getActiveValueFromState());
    }

    /**
     * @param {PartName} activeName
     * @param {{[key: string|number]: SCP}=} value
     */
    switchTo(activeName, value) {
        const previousActiveState = this.activeComponent?.getStateCopy();
        this.activeComponent?.close();
        super.replacePart(this.activeNameKey, activeName);
        this.activeComponent?.render(value ?? previousActiveState);
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP|PartName=} newPart
     * @param {PartName=} [newPartName=previousPartName] indicates the new active name
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName = previousPartName, dontRecordChanges) {
        // check for active name (aka the property/part that indicates the current status) change
        if (newPartName === this.activeNameKey) {
            // active name changed while the value is the previous one
            this.switchTo(newPart);
            return;
        }
        // active name (aka the property/part that indicates the current status) not changed
        super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        // the entire state minus activeNameKey *is* the active component's state
        this.switchTo(this.activeName, this._getActiveValueFromState());
    }

    /**
     * @return {*}
     * @protected
     */
    _getActiveValueFromState() {
        const switcherState = this.getStateCopy();
        if (this.valueKeyIsActiveName) {
            // active value is the state part pointed by the active name
            const activeName = switcherState?.[this.activeNameKey];
            return activeName == null ? undefined : switcherState[activeName];
        } else if (this.activeValueKey != null) {
            // active value is a fixed state part, the one specified by activeValueKey
            return switcherState?.[this.activeValueKey];
        }
        // active value is blended into SwitcherComponent state
        // all but SwitcherComponent's specific state-parts (i.e. activeNameKey) represent the active value
        return switcherState;
    }
}