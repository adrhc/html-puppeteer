import {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import {partOf} from "../../../util/GlobalConfig.js";

/**
 * @typedef {Object} ChildrenCollectionOptions
 * @property {AbstractContainerComponent=} parent
 * @property {boolean=} dontRenderChildren
 * @property {CreateComponentParams=} childrenOptions are the options used to create the components for found shells
 */

/**
 * @template SCT, SCP
 */

/**
 * - creates/removes container's children
 * - queries to find specific children
 * - operations valid on all or some children (e.g. close and disconnect)
 */
export default class ChildrenCollection {
    /**
     * @type {ComponentsCollection}
     */
    children = {};
    /**
     * @type {CreateComponentParams}
     */
    childrenOptions
    /**
     * @type {boolean}
     */
    dontRenderChildren;
    /**
     * @type {AbstractComponent}
     */
    parent;

    /**
     * @return {AbstractComponent[]}
     */
    get childrenArray() {
        return Object.values(this.children);
    }

    /**
     * @param {ChildrenCollectionOptions} options
     */
    constructor({parent, dontRenderChildren, childrenOptions}) {
        this.parent = parent;
        this.dontRenderChildren = dontRenderChildren;
        this.childrenOptions = {parent, ...childrenOptions};
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     */
    createComponentForShell($shell) {
        const component = createComponent($shell, this.childrenOptions);
        isTrue(component != null, "[ChildrenCollection] the child's shell must exist!");
        if (this.parent != null && partOf($shell) == null) {
            // switcher (usually) uses children without "data-part"
            console.warn("[ChildrenCollection] partName is missing though parent is set!");
        }
        this.children[component.id] = this.dontRenderChildren ? component : component.render();
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    getChildrenByPartName(partName) {
        return this.childrenArray.filter(it => partName === it.partName);
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return this.children[itemId];
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     * @return {AbstractComponent | undefined}
     */
    getChildByShell($shell) {
        return this.childrenArray.find(it => it.$elem[0] === $shell[0]);
    }

    /**
     * @param {function(c: AbstractComponent)} visitorFn
     */
    accept(visitorFn) {
        this.childrenArray.forEach(c => visitorFn(c));
    }

    /**
     * @param {function(c: AbstractComponent)} filterFn
     * @return {AbstractComponent[]}
     */
    filter(filterFn) {
        return this.childrenArray.filter(filterFn);
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    closeAndRemoveByPartName(partName) {
        const childrenByPartName = this.getChildrenByPartName(partName);
        if (!childrenByPartName.length) {
            console.error(`Trying to close missing child: ${partName}!`);
            return undefined;
        }
        childrenByPartName.forEach(it => {
            delete this.children[it.id];
            it.close();
        })
        return childrenByPartName;
    }

    /**
     * close and remove each item
     */
    closeAndRemoveAll() {
        this.closeAll();
        this.removeAll();
    }

    /**
     * Detach event handlers then remove all children.
     */
    disconnectAndRemoveAll() {
        this.childrenArray.forEach(child => child.disconnect());
        this.removeAll();
    }

    /**
     * close all children
     */
    closeAll() {
        this.childrenArray.forEach(c => c.close());
    }

    /**
     * Removes all children.
     */
    removeAll() {
        this.children = {};
    }
}