import animate, {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import {childStateOf} from "../configurator/DefaultComponentConfigurator.js";

/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @template SCT, SCP
 */
export default class ChildrenComponents {
    /**
     * @type {string|jQuery<HTMLElement>}
     */
    elemIdOrJQuery;
    /**
     * @type {ComponentsCollection}
     */
    items = {};
    /**
     * @type {AbstractComponent}
     */
    parent;

    /**
     * @param {AbstractComponent} parent
     */
    constructor(parent) {
        this.parent = parent;
        this.elemIdOrJQuery = parent.config.elemIdOrJQuery;
    }

    /**
     * Detect, instantiates, stores and renders all parent's components.
     */
    autodetectChildren() {
        this.items = {};
        animate({parent: this.parent}, {
            parentComponentElem: $(this.elemIdOrJQuery), alwaysReturnArray: true
        }).forEach(c => this.items[c.partName] = c);
    }

    /**
     * @param {PartName} partName
     * @param {jQuery<HTMLElement>} $shell
     */
    createItem(partName, $shell) {
        if (!$shell.length) {
            console.warn(`Missing child element for ${partName}!`);
            return;
        }
        if (this.items[partName]) {
            this.updateFromParent(partName);
            return;
        }
        // at this point the item component's id is available as data-GlobalConfig.COMPONENT_ID on $shell
        const component = createComponent($shell, {parent: this.parent});
        isTrue(component != null, "[createItem] the child's shell must exist!")
        this.items[partName] = component.render();
    }

    /**
     * @param {PartName} partName
     */
    updateFromParent(partName) {
        this.items[partName].replaceState(childStateOf(partName, this.parent));
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    removeItem(partName) {
        if (!this.items[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.items[partName].close();
        delete this.items[partName];
        return true;
    }

    /**
     * close and remove each item
     */
    removeAll() {
        Object.keys(this.items).forEach(partName => this.removeItem(partName));
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getItemById(itemId) {
        return Object.values(this.items).find(it => it.id === itemId);
    }
}