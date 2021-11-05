import StateChangesHandler from "./StateChangesHandler.js";
import SimpleTemplateView from "../view/SimpleTemplateView.js";
import {hierarchyAwareViewValuesTransformer} from "../state/view-transformers.js";

/**
 * @typedef {function(options: Bag): AbstractView} ViewProviderFn
 */
/**
 * @typedef {AbstractTemplateViewOptions} ComponentIllustratorOptions
 * @property {ViewProviderFn=} viewProviderFn
 * @property {ViewValuesTransformerFn=} viewValuesTransformer
 * @property {string=} componentId
 * @property {AbstractComponent=} parent
 * @property {PartName=} part
 */
/**
 * @template SCT, SCP
 */
export default class ComponentIllustrator extends StateChangesHandler {
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {ComponentIllustratorOptions} options
     * @param {ViewProviderFn=} options.viewProviderFn
     * @param {string} options.componentId
     * @param {AbstractComponent=} options.parent
     * @param {PartName=} options.part
     * @param {AbstractTemplateViewOptions=} restOfOptions
     */
    constructor({viewProviderFn, componentId, parent, part, ...restOfOptions}) {
        super();
        const viewValuesTransformer = hierarchyAwareViewValuesTransformer(componentId, parent?.id, part)
        const viewOptions = {viewValuesTransformer, ...restOfOptions}
        this.view = viewProviderFn?.(viewOptions) ?? new SimpleTemplateView(viewOptions);
    }

    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {
        this.view.create(stateChange.newState);
    }

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {
        this.view.replace(stateChange.newState);
    }

    /**
     * @param {StateChange} stateChange
     */
    removed(stateChange) {
        this.view.remove();
    }
}

/**
 * @param {AbstractComponent} component
 * @return {ComponentIllustrator}
 */
export function componentIllustratorOf(component) {
    return new ComponentIllustrator({
        componentId: component.id, ...component.config
    });
}
