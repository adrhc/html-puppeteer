import StateChangesHandler from "./StateChangesHandler.js";
import SimpleView from "./SimpleView.js";

export default class ComponentIllustrator extends StateChangesHandler {
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {Object} config
     * @param {AbstractView=} config.view
     * @param {{}} viewConfig
     */
    constructor({view, ...viewConfig}) {
        super();
        this.view = view ?? new SimpleView(viewConfig);
    }

    /**
     * @param {{}} viewConfig
     * @return {SimpleView}
     * @protected
     */
    _createView(viewConfig) {
        return new SimpleView(viewConfig);
    }

    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {
        this.view.create(stateChange.newStateOrPart);
    }

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {
        this.view.replace(stateChange.newStateOrPart);
    }

    /**
     * @param {StateChange} stateChange
     */
    removed(stateChange) {
        this.view.remove();
    }
}