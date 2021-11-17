import GlobalConfig from "../../../util/GlobalConfig.js";
import createShellTemplate, {areShellTemplateOptionsEmpty} from "./ChildShellTemplate.js";
import {newIdImpl} from "../../component/configurator/DefaultComponentConfigurator.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import {generateHtml} from "../../../util/HtmlGenerator.js";

/**
 * @typedef {ChildShellTemplateOptions} ShellCreatorOptions
 * @property {string} parentId
 * @property {string=} containerHtml
 */

/**
 * Dealing with component's shell HTML element creation.
 */
export default class ShellCreator {
    /**
     * it's the child shell template id
     *
     * @type {string}
     */
    parentId;
    /**
     * @type {string}
     */
    shellTemplate;
    /**
     * @type {boolean}
     */
    shellTemplateNeedsOwner;

    /**
     * @param {ShellCreatorOptions} options
     * @param {ChildShellTemplateOptions} options.restOfOptions
     */
    constructor({
                    parentId,
                    containerHtml,
                    ...restOfOptions
                }) {
        this.parentId = parentId;
        this.shellTemplateNeedsOwner = areShellTemplateOptionsEmpty(restOfOptions);
        this.shellTemplate = this.shellTemplateNeedsOwner ?
            containerHtml?.trim() : createShellTemplate(parentId, restOfOptions);
    }

    /**
     * @param {PartName} partName
     * @return {string}
     */
    createShell(partName) {
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
            [GlobalConfig.COMPONENT_ID]: newIdImpl(partName, this.parentId),
        };
        let shellTemplate = this.shellTemplate;
        if (this.shellTemplateNeedsOwner) {
            shellTemplate = this._setPartOwnerAndIdToShellTemplate(viewValues);
        }
        return generateHtml(shellTemplate, viewValues);
    }

    /**
     * @param {Bag} partOwnerAndId
     * @return {string}
     * @protected
     */
    _setPartOwnerAndIdToShellTemplate(partOwnerAndId) {
        const $shell = $(this.shellTemplate);
        isTrue($shell.length === 1,
            `$shell template from parent is ${$shell?.length ? "too crowded" : "empty"}! should have exactly one element!`)
        Object.keys(partOwnerAndId).forEach(key => $shell.attr(`data-${key}`, partOwnerAndId[key]));
        return $shell[0].outerHTML;
    }
}
