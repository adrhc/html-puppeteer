import AbstractComponent from "./AbstractComponent.js";
import SimpleComponentIllustrator from "../state-changes-handler/SimpleComponentIllustrator.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super({
            componentIllustrator: componentIllustrator ?? new SimpleComponentIllustrator(restOfOptions),
            ...restOfOptions
        });
    }
}