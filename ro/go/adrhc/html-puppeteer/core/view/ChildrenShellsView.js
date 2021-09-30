import AbstractView from "./AbstractView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {dataOwnerSelectorOf} from "../../util/SelectorUtils.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {uniqueId} from "../../util/StringUtils.js";
import shellTemplateOf, {shellTemplateOptionsAreEmpty} from "./ChildShellTemplate.js";
import {isFalse} from "../../util/AssertionUtils.js";
import ChildrenShellFinder from "./ChildrenShellFinder.js";

/**
 * @typedef {ChildShellTemplateOptions} ChildrenShellsViewOptions
 * @property {string} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {boolean=} newGuestsGoLast
 * @property {boolean=} persistentShells
 */
/**
 * @extends {AbstractView}
 */
export default class ChildrenShellsView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
    /**
     * it's the child shell template id
     *
     * @type {string}
     */
    parentId;
    /**
     * @type {boolean}
     */
    persistentShells;
    /**
     * specify where to place new kids (append|prepend)
     *
     * @type {string}
     */
    place;
    /**
     * @type {string}
     */
    shellTemplate;

    /**
     * @param {ChildrenShellsViewOptions} options
     * @param {ChildShellTemplateOptions} options.restOfOptions
     */
    constructor({
                    componentId,
                    elemIdOrJQuery,
                    newGuestsGoLast,
                    persistentShells,
                    ...restOfOptions
                }) {
        super();
        this.persistentShells = persistentShells ?? shellTemplateOptionsAreEmpty(restOfOptions);
        this.childrenShellFinder = new ChildrenShellFinder(componentId, elemIdOrJQuery, this.persistentShells);
        this.parentId = componentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = newGuestsGoLast ? "append" : "prepend";
        this.shellTemplate = shellTemplateOf(componentId, restOfOptions);
    }

    /**
     * @param {PartName} partName
     */
    create(partName) {
        const $shell = this.childrenShellFinder.$shellElemOf(partName);
        if ($shell) {
            return $shell;
        }
        isFalse(this.persistentShells,
            `Can't have persistent shells while also a shell template!\nMake sure to have ${dataOwnerSelectorOf(this.parentId)} on the "${partName}" persistent shell!`);
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
            [GlobalConfig.COMPONENT_ID]: uniqueId(),
        };
        const kidSeat = generateHtml(this.shellTemplate, viewValues);
        this.$containerElem[this.place](kidSeat);
        return this.childrenShellFinder.$shellElemOf(partName);
    }

    /**
     * @param {PartName} partName
     */
    remove(partName) {
        if (!this.persistentShells) {
            this.childrenShellFinder.$shellElemOf(partName).remove();
        }
    }

    /**
     * @param {*} values
     */
    replace(values) {
        // do nothing
    }
}