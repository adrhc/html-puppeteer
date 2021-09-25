import StateChangesHandler from "./StateChangesHandler.js";
import {simpleTemplateViewProvider} from "../view/SimpleTemplateView.js";

/**
 * @typedef {function(options: Bag): AbstractView} ViewProviderFn
 */
/**
 * @typedef {AbstractView} ComponentIllustratorOptions
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
     * @param {AbstractView=} options.viewConfig
     */
    constructor({view, viewProviderFn, ...viewConfig}) {
        super();
        this.view = (viewProviderFn ?? simpleTemplateViewProvider)(viewConfig);
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