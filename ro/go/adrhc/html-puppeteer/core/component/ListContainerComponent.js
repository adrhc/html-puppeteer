import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import ListContainerIllustrator from "../state-changes-handler/ListContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import ChildrenComponents from "./ChildrenComponents.js";

/**
 * @typedef {AbstractComponentOptions} ListContainerComponentOptions
 * @property {ComponentsCollection} items
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class ListContainerComponent extends AbstractComponent {
    childrenComponents = new ChildrenComponents(this);

    /**
     * @param {ListContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider((c) =>
                new ListContainerIllustrator(/** @type {ListContainerComponent} */c))
            .withEventsBinders(new ContainerEventsBinder())
            .options());
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        this.items = this.config.items ?? {};
        // initializing the container state with [] or {} depending on the newState
        // the container's view will kick in to render its static content (if any)
        this._replaceContainerStateOnly(newState);
        // updating items (aka parts) state
        this.replaceParts(newState);
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getItemById(itemId) {
        return this.childrenComponents.getItemById(itemId);
    }

    /**
     * @param {SCT=} newState
     * @protected
     */
    _replaceContainerStateOnly(newState) {
        if (newState == null) {
            super.replaceState(newState);
        } else {
            super.replaceState(_.isArray(newState) ? [] : {});
        }
    }
}
