import ChildrenShellFinder from "../core/view/shells/ChildrenShellFinder.js";
import ChildrenCollection from "../core/component/composition/ChildrenCollection.js";
import ShellCreator from "../core/view/shells/ShellCreator.js";
import ShellsManager from "../core/view/shells/ShellsManager.js";

/**
 * @typedef {Object} ContainerChildrenCommonOptions
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {string=} removedPlaceholder
 * @property {string=} removedCss
 */
export default class ContainerHelper {
    /**
     * @type {AbstractComponent}
     */
    component;

    /**
     * @return {ComponentConfigField}
     */
    get config() {
        return this.component.config;
    }

    /**
     * @param {AbstractComponent} component
     */
    constructor(component) {
        this.component = component;
    }

    /**
     * @return {ContainerChildrenCommonOptions}
     */
    createContainerChildrenCommonOptions() {
        return _.defaults({}, this.config.childrenOptions, {
            viewRemovalStrategy: this.config.childrenRemovalStrategy,
            removedPlaceholder: this.config.childrenRemovedPlaceholder,
            removedCss: this.config.childrenRemovedCss,
        });
    }

    /**
     * @return {ChildrenShellFinder}
     */
    createChildrenShellFinder() {
        return this.config.childrenShellFinder ?? new ChildrenShellFinder(this.config.elemIdOrJQuery);
    }

    /**
     * @return {ChildrenCollection}
     */
    createChildrenCollection() {
        return new ChildrenCollection({
            parent: this.component,
            dontRenderChildren: this.config.dontRenderChildren,
            childrenShellFinder: this.createChildrenShellFinder(),
            childrenOptions: this.createContainerChildrenCommonOptions()
        });
    }

    /**
     * @return {ShellCreator}
     */
    createShellCreator() {
        return this.config.shellCreator ?? new ShellCreator({parentId: this.component.id, ...this.config});
    }

    /**
     * @return {ShellsManager}
     */
    createShellsManager() {
        return new ShellsManager(this.createChildrenShellFinder(), this.createShellCreator(),
            this.config.elemIdOrJQuery, this.config.newChildrenGoLast);
    }
}