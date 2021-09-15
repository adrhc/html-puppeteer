import AbstractComponent from "./AbstractComponent.js";
import ComponentIllustrator from "./ComponentIllustrator.js";
import DomUtils from "../util/DomUtils.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {{}} config
     */
    constructor(config = {}) {
        super({
            componentIllustrator: new ComponentIllustrator(config),
            ...config
        });
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