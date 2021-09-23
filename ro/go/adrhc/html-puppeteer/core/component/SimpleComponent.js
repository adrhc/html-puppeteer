import SimplePartsIllustrator from "../state-changes-handler/SimplePartsIllustrator.js";
import AbstractComponent from "./AbstractComponent.js";
import {addComponentIllustratorProvider} from "./options/ComponentOptionsBuilder.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptions} options
     * @param {ComponentIllustrator} options.componentIllustrator
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({componentIllustrator, ...restOfOptions} = {}) {
        super(addComponentIllustratorProvider(config =>
            (componentIllustrator ?? new SimplePartsIllustrator(config))).to(restOfOptions));
    }
}