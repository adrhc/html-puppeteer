import {simplePartsIllustratorOf} from "../state-changes-handler/SimplePartsIllustrator.js";
import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import PartialStateHolder from "../state/PartialStateHolder.js";

export default class SimpleComponent extends AbstractComponent {
    /**
     * @param {AbstractComponentOptions} options
     * @param {StateChangesHandlerProviderFn[]=} options.componentIllustratorProviders
     * @param {AbstractComponentOptions} restOfOptions
     */
    constructor({componentIllustratorProviders, ...restOfOptions}) {
        super(withDefaults(restOfOptions)
            .withStateHolderProvider(config => new PartialStateHolder(config))
            // the view should be updated when partial changes occur, that's
            // why SimplePartsIllustrator is used instead of ComponentIllustrator
            .addComponentIllustratorProvider(component =>
                simplePartsIllustratorOf(component), !!componentIllustratorProviders?.length).options());
    }
}