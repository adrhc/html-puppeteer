import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import ChildrenComponents from "./composition/ChildrenComponents.js";

/**
 * @typedef {AbstractComponentOptions & ContainerEventsBinderOptions & ChildrenComponentsOptions & SimpleContainerIllustratorOptions} SimpleContainerComponentOptions
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class SimpleContainerComponent extends AbstractComponent {
    childrenComponents = new ChildrenComponents({parent: this});

    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .addComponentIllustratorProvider((container) =>
                new SimpleContainerIllustrator(/** @type {SimpleContainerComponent} */ container))
            .withEventsBinders(new ContainerEventsBinder())
            .options());
    }

    /**
     * @param {string} childId
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePartByChildId(childId, newPart, newPartName) {
        const partName = this.childrenComponents.getItemById(childId).partName;
        this.replacePart(partName, newPart, newPartName);
    }

    /**
     * set state to undefined
     */
    close() {
        this.childrenComponents.closeAndRemoveChildren();
        super.close();
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.childrenComponents.disconnectAndRemoveChildren();
        super.disconnect();
    }
}
