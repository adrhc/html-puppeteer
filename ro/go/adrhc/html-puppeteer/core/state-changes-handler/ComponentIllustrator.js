import StateChangesHandler from "./StateChangesHandler.js";
import SimpleTemplateView from "../view/SimpleTemplateView.js";

/**
 * @typedef {function(options: Bag): AbstractView} ViewProviderFn
 */
/**
 * @typedef {AbstractTemplateViewOptions} ComponentIllustratorOptions
 * @property {ViewProviderFn=} viewProviderFn
 */
/**
 * @template SCT, SCP
 */
export default class ComponentIllustrator extends StateChangesHandler {
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {ComponentIllustratorOptions} options
     * @param {ComponentIllustratorOptions} options.viewProviderFn
     * @param {AbstractTemplateViewOptions=} restOfOptions
     */
    constructor({viewProviderFn, ...restOfOptions}) {
        super();
        this.view = viewProviderFn?.(restOfOptions) ?? new SimpleTemplateView(restOfOptions);
    }

    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {
        this.view.create(stateChange.newState);
    }

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {
        this.view.replace(stateChange.newState);
    }

    /**
     * @param {StateChange} stateChange
     */
    removed(stateChange) {
        this.view.remove();
    }
}