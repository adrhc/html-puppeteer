import ComponentIllustrator from "./ComponentIllustrator.js";
import SimpleView from "./SimpleView.js";

export default class SimpleComponentIllustrator extends ComponentIllustrator {
    /**
     * @param {Object} options
     * @param {AbstractView=} options.view
     * @param {AbstractTemplatingViewOptions} viewConfig
     */
    constructor({view, ...viewConfig}) {
        super();
        this.view = view ?? this._createView(viewConfig);
    }

    /**
     * @param {AbstractTemplatingViewOptions} viewConfig
     * @return {SimpleView}
     * @protected
     */
    _createView(viewConfig) {
        return new SimpleView(viewConfig);
    }
}