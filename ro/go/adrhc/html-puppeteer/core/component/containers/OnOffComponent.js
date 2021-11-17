import {USE_CSS} from "../../view/SimpleView.js";
import GlobalConfig, {activeNameOf} from "../../../util/GlobalConfig.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

/**
 * @typedef {AbstractContainerComponentOptions} OnOffComponentOptions
 * @property {string=} activeNamesKey identify the part storing the active-component names
 */

/**
 * @template SCT,SCP
 *
 * @typedef {Object} SCT
 * @property {OptionalPartName=} activeNames
 * @property {SCP=} partValue
 */
export default class OnOffComponent extends AbstractContainerComponent {
    /**
     * @type {string}
     */
    activeNamesKey;

    /**
     * @return {PartName[]}
     */
    get activeNames() {
        return this.getPart(this.activeNamesKey);
    }

    /**
     * @param {OnOffComponentOptions} options
     */
    constructor(options) {
        super({
            childrenRemovalStrategy: USE_CSS,
            ignoreShellTemplateOptions: true,
            dontRenderChildren: true,
            ...options
        });
        this.activeNamesKey = this.config.activeNamesKey ?? GlobalConfig.ACTIVE_NAME_KEY;
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.childrenCollection.closeAndRemoveAll();
        super.replaceState(_.omit(newState, this.activeNamesKey));
        this.createChildrenForAllShells();
        // the children render as "closed"
        this.childrenCollection.closeAll();
        this.switchTo(newState?.[this.activeNamesKey]);
    }

    /**
     * @param {PartName=} previousPartName
     * @param {SCP|PartName=} newPart
     * @param {PartName=} [newPartName=previousPartName] indicates the new active name
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName = previousPartName, dontRecordChanges) {
        isTrue(previousPartName === newPartName, "[OnOffComponent] previousPartName !== newPartName!")
        // check for active name (aka the property/part that indicates the current status) change
        if (newPartName === this.activeNamesKey) {
            // active name changed while the value is the previous one
            this.switchTo(/** @type {PartName[]} */ newPart);
            return;
        }
        // active name (aka the property/part that indicates the current status) not changed
        super.replacePart(previousPartName, newPart, newPartName, dontRecordChanges);
        if (this.activeNames?.includes(previousPartName)) {
            this.childrenCollection.getChildrenByPartName(previousPartName).forEach(it => it.replaceState(newPart));
        }
    }

    /**
     * @param {PartName[]} newActiveNames
     */
    switchTo(newActiveNames) {
        const previousActiveNames = this.activeNames;
        super.replacePart(this.activeNamesKey, newActiveNames);
        this.childrenCollection.accept(c => {
            const activeName = activeNameOf(c);
            if (!newActiveNames?.includes(activeName)) {
                this._switchOff(activeName);
            } else if (!previousActiveNames?.includes(activeName)) {
                this._switchOn(activeName, this.getPart(c.partName));
            }
        })
    }

    /**
     * @param {PartName} activeName
     * @protected
     */
    _switchOff(activeName) {
        this.childrenCollection.accept(it => {
            if (activeName === activeNameOf(it)) {
                it.close()
            }
        });
    }

    /**
     * @param {PartName} activeName
     * @param {SCP} partValue
     * @protected
     */
    _switchOn(activeName, partValue) {
        this.childrenCollection.accept(it => {
            if (activeName === activeNameOf(it)) {
                it.render(partValue);
            }
        });
    }
}