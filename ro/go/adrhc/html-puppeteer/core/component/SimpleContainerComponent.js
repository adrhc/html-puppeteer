import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import SimpleContainerIllustrator from "../state-changes-handler/SimpleContainerIllustrator.js";
import ContainerEventsBinder from "./events-binder/ContainerEventsBinder.js";
import ChildrenComponents from "./composition/ChildrenComponents.js";

/**
 * @typedef {AbstractComponentOptions} SimpleContainerComponentOptions
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
            .addComponentIllustratorProvider((c) =>
                new SimpleContainerIllustrator(/** @type {SimpleContainerComponent} */c))
            .withEventsBinders(new ContainerEventsBinder())
            .options());
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return this.childrenComponents.getItemById(itemId);
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
