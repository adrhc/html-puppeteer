import AbstractComponent from "./AbstractComponent.js";
import ComponentIllustrator from "./ComponentIllustrator.js";

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
}