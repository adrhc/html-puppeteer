import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import ListContainerIllustrator from "../state-changes-handler/ListContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import ChildrenGroup from "./ChildrenGroup.js";

/**
 * @typedef {AbstractComponentOptions} ListContainerComponentOptions
 * @property {ComponentsCollection} items
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class ListContainerComponent extends AbstractComponent {
    childrenGroup = new ChildrenGroup(this);

    /**
     * @param {ListContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider(listContainerIllustratorProvider)
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
        // it's about whether the parent state is an Array or Object (i.e. Map)
        const roomLayout = this._roomStructureFor(newState);
        // using parent's view (only) to render the component's layout
        super.replaceState(roomLayout);
        // updating items (aka parts) state
        this.replaceParts(newState);
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getItemById(itemId) {
        return this.childrenGroup.getItemById(itemId);
    }

    /**
     * @param {SCT=} newState new full/total state
     * @protected
     */
    _roomStructureFor(newState) {
        if (newState == null) {
            return newState;
        }
        return _.isArray(newState) ? [] : {};
    }
}

/**
 * @param {ListContainerComponent} component
 * @return {ListContainerIllustrator}
 */
function listContainerIllustratorProvider(component) {
    return new ListContainerIllustrator(component);
}
