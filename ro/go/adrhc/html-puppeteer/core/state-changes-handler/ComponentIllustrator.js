import StateChangesHandler from "./StateChangesHandler.js";
import {simpleTemplateViewProvider} from "../view/SimpleTemplateView.js";

/**
 * @typedef {function(options: Bag): AbstractView} ViewProviderFn
 */
/**
 * @typedef {AbstractTemplateViewOptions} ComponentIllustratorOptions
 * @property {ViewProviderFn=} viewProviderFn
 */
/**
 * @template SCT, SCP
 *
 * @extends {StateChangesHandler}
 * @abstract
 */
export default class ComponentIllustrator extends StateChangesHandler {
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {ComponentIllustratorOptions} options
     * @param {AbstractTemplateViewOptions=} restOfOptions
     */
    constructor({view, viewProviderFn, ...restOfOptions}) {
        super();
        this.view = (viewProviderFn ?? simpleTemplateViewProvider)(restOfOptions);
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