import SimplePartComponentIllustrator from "../state-changes-handler/SimplePartComponentIllustrator.js";
import AbstractContainerComponent from "./AbstractContainerComponent.js";

export default class SimpleComponent extends AbstractContainerComponent {
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