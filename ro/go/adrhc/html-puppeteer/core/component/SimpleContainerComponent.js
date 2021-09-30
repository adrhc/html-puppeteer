import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import ChildrenComponents from "./composition/ChildrenComponents.js";
import {partsOf} from "../state/PartialStateHolder.js";

/**
 * @typedef {AbstractComponentOptions} SimpleContainerComponentOptions
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class SimpleContainerComponent extends AbstractComponent {
    childrenComponents = new ChildrenComponents(this);
    /**
     * @type {boolean}
     */
    newGuestsGoLast;

    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider((c) =>
                new SimpleContainerIllustrator(/** @type {SimpleContainerComponent} */c))
            .withEventsBinders(new ContainerEventsBinder())
            .options());
        this.newGuestsGoLast = this.config.newGuestsGoLast;
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        // this must happen before container redraw to give
        // a chance to the children to close themselves
        this.childrenComponents.removeAll();
        // initializing the container state with [] or {} depending on the newState
        // the container's view will kick in to render its static content (if any)
        this._replaceContainerStateOnly(newState);
        // each newState's field is considered a "part"
        this.replaceParts(newState);
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}[]|SCT} parts
     */
    replaceParts(parts) {
        partsOf(parts, !this.newGuestsGoLast)
            .forEach(([key, value]) => this.replacePart(key, value));
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
