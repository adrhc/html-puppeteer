import StateChangesHandler from "./StateChangesHandler.js";

/**
 * @typedef {function(options: SimpleViewOptions): AbstractView} ViewProviderFn
 */
/**
 * @typedef {Object} ComponentIllustratorOptions
 * @property {AbstractView=} view
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
     * @param {SimpleViewOptions=} options.viewConfig
     */
    constructor({view, viewProviderFn, ...viewConfig}) {
        super();
        this.view = view ?? viewProviderFn(viewConfig);
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