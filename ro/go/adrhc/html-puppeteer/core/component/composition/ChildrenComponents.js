import {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import ChildrenShellFinder from "../../view/ChildrenShellFinder.js";

/**
 * @typedef {Object} ChildrenComponentsOptions
 * @property {SimpleContainerComponent=} parent
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} dontRenderChildren
 * @property {Bag=} childrenCreationCommonOptions
 */
/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @template SCT, SCP
 */
export default class ChildrenComponents {
    /**
     * @type {ComponentsCollection}
     */
    children = {};
    /**
     * @type {Object}
     */
    childrenCreationCommonOptions
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
    /**
     * @type {boolean}
     */
    dontRenderChildren;
    /**
     * @type {AbstractComponent}
     */
    parent;

    /**
     * @param {ChildrenComponentsOptions} options
     * @param {AbstractComponent=} options.parent
     * @param {ChildrenShellFinder=} options.childrenShellFinder
     * @param {boolean=} options.dontRenderChildren
     * @param {Object=} options.childrenCreationCommonOptions
     */
    constructor({parent, childrenShellFinder, dontRenderChildren, childrenCreationCommonOptions}) {
        this.parent = parent;
        this.dontRenderChildren = dontRenderChildren;
        this.childrenCreationCommonOptions = childrenCreationCommonOptions;
        const elemIdOrJQuery = parent?.config.elemIdOrJQuery ?? document;
        this.childrenShellFinder = childrenShellFinder ?? new ChildrenShellFinder(elemIdOrJQuery);
    }

    /**
     * - purge this.children collection
     * - detect existing shells
     * - create the components corresponding to shells
     * - store the components into this.children collection
     * - render all children
     *
     * @return {ComponentsCollection}
     */
    createChildrenForExistingShells() {
        this.children = {};
        this.childrenShellFinder.$childrenShells()
            .map($elem => createComponent($elem, {parent: this.parent, ...this.childrenCreationCommonOptions}))
            .forEach(c => this.children[c.partName ?? c.id] = c.render());
        return {...this.children};
    }

    /**
     * @param {PartName} partName
     * @param {jQuery<HTMLElement>} $shell
     */
    createOrUpdateChild(partName, $shell) {
        if (!$shell.length) {
            console.warn(`Missing child element for ${partName}!`);
            return;
        }
        if (this.children[partName]) {
            this.updateFromParent(partName);
            return;
        }
        // at this point the item component's id is available as data-GlobalConfig.COMPONENT_ID on $shell
        const component = createComponent($shell, {parent: this.parent});
        isTrue(component != null, "[createOrUpdateChild] the child's shell must exist!")
        this.children[partName] = this.dontRenderChildren ? component : component.render();
    }

    /**
     * @param {PartName} partName
     */
    updateFromParent(partName) {
        this.children[partName].replaceFromParent();
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    closeAndRemoveChild(partName) {
        if (!this.children[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.children[partName].close();
        delete this.children[partName];
        return true;
    }

    /**
     * close and remove each item
     */
    closeAndRemoveChildren() {
        Object.keys(this.children).forEach(partName => this.closeAndRemoveChild(partName));
    }

    /**
     * Detach event handlers then remove all children.
     */
    disconnectAndRemoveChildren() {
        Object.values(this.children).forEach(child => child.disconnect());
        this.children = {};
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return Object.values(this.children).find(it => it.id === itemId);
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     */
    getChildByPartName(partName) {
        return this.children[partName];
    }
}