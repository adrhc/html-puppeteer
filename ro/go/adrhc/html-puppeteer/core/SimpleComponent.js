import AbstractComponent from "./AbstractComponent.js";
import ComponentIllustrator from "./ComponentIllustrator.js";
import DomUtils from "../util/DomUtils.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @type {{}}
     */
    dataAttributes;

    /**
     * @param {{}} config
     */
    constructor(config = {}) {
        super({
            componentIllustrator: new ComponentIllustrator(config),
            ...config
        });
        this.dataAttributes = this._extractDataAttributes();
        this.stateInitializer = this.stateInitializer ?? this._createStateInitializer(this.dataAttributes.state);
    }

    /**
     * @protected
     */
    _extractDataAttributes() {
        const dataOfViewElements = this.stateChangesHandlerAdapter
            .stateChangesHandlers.map(sch => sch.view?.$elem)
            .filter(el => el != null && el.length)
            .map(el => DomUtils.dataOf(el));
        return Object.assign({}, ...dataOfViewElements);
    }
}