import SimplePartComponentIllustrator from "../state-changes-handler/SimplePartComponentIllustrator.js";
import AbstractComponent from "./AbstractComponent.js";
import {addComponentIllustratorProvider, addConfigurator} from "./options/AbstractComponentOptionsBuilder.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        /*super({
            componentIllustrator: componentIllustrator ?? new SimplePartComponentIllustrator(restOfOptions),
            ...restOfOptions
        });*/
        super(addComponentIllustratorProvider(config =>
            (componentIllustrator ?? new SimplePartComponentIllustrator(config))).to(restOfOptions));
    }
}