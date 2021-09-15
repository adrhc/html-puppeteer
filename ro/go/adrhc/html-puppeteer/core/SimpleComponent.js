import AbstractComponent from "./AbstractComponent.js";
import SimpleComponentIllustrator from "./SimpleComponentIllustrator.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {AbstractComponentOptions} options.restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super({
            componentIllustrator: componentIllustrator ?? new SimpleComponentIllustrator(restOfOptions),
            ...restOfOptions
        });
    }
}