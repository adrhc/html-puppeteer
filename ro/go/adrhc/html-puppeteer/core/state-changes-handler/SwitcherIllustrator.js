import ComponentIllustrator from "./ComponentIllustrator.js";
import SwitcherView from "../view/SwitcherView.js";

/**
 * @typedef {ComponentIllustratorOptions & SwitcherViewOptions} SwitcherIllustratorOptions
 * @property {string} activeNameKey
 */
/**
 * @template SCT, SCP
 * @extends {PartialStateChangesHandler}
 */
export default class SwitcherIllustrator extends ComponentIllustrator {
    /**
     * @type {string}
     */
    activeNameKey;

    /**
     * @return {SwitcherView}
     */
    get switcherView() {
        return /** @type {SwitcherView} */ this.view;
    }

    /**
     * @param {SwitcherIllustratorOptions} options
     * @param {string} options.activeNameKey
     * @param {ViewProviderFn=} options.viewProviderFn
     * @param {ComponentIllustratorOptions=} restOfOptions
     */
    constructor({activeNameKey, viewProviderFn, ...restOfOptions}) {
        super({
            viewProviderFn: viewProviderFn ?? (() => new SwitcherView(restOfOptions)),
            ...restOfOptions
        });
        this.activeNameKey = activeNameKey;
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partChangeOccurred(partStateChange) {
        if ((partStateChange.previousPartName ?? partStateChange.newPartName) === this.activeNameKey) {
            this.switcherView.switch(/** @type {string} */ partStateChange.previousPart,
                /** @type {string} */ partStateChange.newPart)
        }
    }
}