import AbstractView from "./AbstractView.js";
import {jQueryOf, templateOf$Elem} from "../../util/DomUtils.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import createShellTemplate, {areShellTemplateOptionsEmpty} from "./ChildShellTemplate.js";
import {isFalse} from "../../util/AssertionUtils.js";
import ChildrenShellFinder from "./ChildrenShellFinder.js";
import {newIdImpl} from "../component/configurator/DefaultComponentConfigurator.js";

/**
 * @typedef {ChildShellTemplateOptions} ChildrenShellsViewOptions
 * @property {string} componentId
 * @property {string|jQuery<HTMLElement>} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {boolean=} newGuestsGoLast
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
     * @type {boolean}
     */
    emptyShellTemplate;
    /**
     * it's the child shell template id
     *
     * @type {string}
     */
    parentId;
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
                    ...restOfOptions
                }) {
        super();
        const shellTemplateFromContainerContent = templateOf$Elem(jQueryOf(elemIdOrJQuery));
        this.emptyShellTemplate = areShellTemplateOptionsEmpty(restOfOptions);
        this.childrenShellFinder = new ChildrenShellFinder(componentId, elemIdOrJQuery);
        this.parentId = componentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = newGuestsGoLast ? "append" : "prepend";
        this.shellTemplate = this.emptyShellTemplate ?
            shellTemplateFromContainerContent : createShellTemplate(componentId, restOfOptions);
    }

    /**
     * @param {PartName} partName
     */
    create(partName) {
        const $shell = this.childrenShellFinder.$childShellByName(partName);
        if ($shell) {
            return $shell;
        }
        isFalse(this.emptyShellTemplate,
            `"${partName}" shell is missing from "${this.parentId}"!\n\nparent content is:\n${this.$containerElem.html()}\nparent text is:\n${this.$containerElem.text()}`);
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
            [GlobalConfig.COMPONENT_ID]: newIdImpl(partName, this.parentId),
        };
        const kidShell = generateHtml(this.shellTemplate, viewValues);
        this.$containerElem[this.place](kidShell);
        return this.childrenShellFinder.$childShellByName(partName);
    }

    /**
     * @param {PartName} partName
     */
    remove(partName) {
        if (!this.emptyShellTemplate) {
            this.childrenShellFinder.$childShellByName(partName).remove();
        }
    }

    /**
     * @param {*} values
     */
    replace(values) {
        // do nothing
    }
}
