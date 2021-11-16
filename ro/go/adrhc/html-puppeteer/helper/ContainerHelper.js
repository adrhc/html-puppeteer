import ChildrenShellFinder from "../core/view/ChildrenShellFinder.js";
import ChildrenCollection from "../core/component/composition/ChildrenCollection.js";
import ChildrenShells from "../core/view/ChildrenShells.js";

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
        return this.childrenCollectionOf(this.createChildrenShellFinder());
    }

    /**
     * @param {ChildrenShellFinder} childrenShellFinder
     * @return {ChildrenCollection}
     */
    childrenCollectionOf(childrenShellFinder) {
        return new ChildrenCollection({
            parent: this.component,
            childrenShellFinder,
            dontRenderChildren: this.config.dontRenderChildren,
            childrenOptions: this.createContainerChildrenCommonOptions()
        });
    }

    /**
     * @return {ChildrenShells}
     */
    createChildrenShells() {
        return this.childrenShellsOf(this.createChildrenShellFinder());
    }

    /**
     * @param {ChildrenShellFinder} childrenShellFinder
     * @return {ChildrenShells}
     */
    childrenShellsOf(childrenShellFinder) {
        return new ChildrenShells({
            componentId: this.component.id, childrenShellFinder, ...this.config
        });
    }
}