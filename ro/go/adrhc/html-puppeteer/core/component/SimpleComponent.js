import AbstractComponent from "./AbstractComponent.js";
import SimplePartComponentIllustrator from "../state-changes-handler/SimplePartComponentIllustrator.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super({
            componentIllustrator: componentIllustrator ?? new SimplePartComponentIllustrator(restOfOptions),
            ...restOfOptions
        });
    }
}