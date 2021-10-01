import {templateOfTemplateId} from "../../util/DomUtils.js";
import GlobalConfig, {dataComponentIdOf, dataOwnerOf, dataPartOf, dataTypeOf} from "../../util/GlobalConfig.js";

/**
 * @typedef {Bag} ShellAttributes
 * @property {string=} template is used by child's component to populate its space (aka shell)
 * @property {string=} templateId
 * @property {string=} type
 * @property {string=} htmlTag
 */

/**
 * @typedef {Object} ChildShellTemplateOptions
 * @property {boolean=} noShellTemplate
 * @property {string=} shellTemplate is the shell's HTML containing the data-type and data-part
 * @property {string=} shellTemplateId
 * @property {string=} shellOccupantTemplate is a shortcut for ShellAttributes.template
 * @property {string=} shellOccupantTemplateId is a shortcut for ShellAttributes.templateId
 * @property {string=} shellOccupantHtmlTag is a shortcut for ShellAttributes.htmlTag
 * @property {string=} shellOccupantType is a shortcut for ShellAttributes.type
 * @property {ShellAttributes=} childShellAttributes
 */

/**
 * @param {ChildShellTemplateOptions} options
 */
export function areShellTemplateOptionsEmpty({
                                                 noShellTemplate,
                                                 shellTemplate,
                                                 shellTemplateId,
                                                 shellOccupantTemplate,
                                                 shellOccupantTemplateId,
                                                 shellOccupantHtmlTag,
                                                 shellOccupantType,
                                                 childShellAttributes = {
                                                     template: shellOccupantTemplate,
                                                     templateId: shellOccupantTemplateId,
                                                     htmlTag: shellOccupantHtmlTag,
                                                     type: shellOccupantType
                                                 }
                                             }) {
    return noShellTemplate || shellTemplate == null && shellTemplateId == null &&
        childShellAttributes.template == null && childShellAttributes.templateId == null;
}

/**
 * @param {string} parentId
 * @param {ChildShellTemplateOptions} options
 * @param {string=} options.shellTemplateId
 * @param {ShellAttributes=} options.childShellAttributes
 * @protected
 */
export default function createShellTemplate(parentId, {
    shellTemplate,
    shellTemplateId,
    shellOccupantTemplate,
    shellOccupantTemplateId,
    shellOccupantHtmlTag,
    shellOccupantType,
    childShellAttributes = {
        template: shellOccupantTemplate,
        templateId: shellOccupantTemplateId,
        htmlTag: shellOccupantHtmlTag,
        type: shellOccupantType
    }
}) {
    if (shellTemplate) {
        return shellTemplate;
    } else if (shellTemplateId) {
        return templateOfTemplateId(shellTemplateId);
    } else {
        return templateFromShellAttributes(parentId, childShellAttributes);
    }
}

/**
 * @param {ShellAttributes=} childShellAttributes
 * @param {string} parentId
 * @return {string}
 * @protected
 */
function templateFromShellAttributes(parentId, {template, templateId, htmlTag = "div", type = "simple"}) {
    return template ?? `<${htmlTag} ${dataTypeOf(type)} ${dataOwnerOf(parentId)} ${dataPartOf(`{{${GlobalConfig.PART}}}`)} ${dataComponentIdOf(`{{${GlobalConfig.COMPONENT_ID}}}`)} data-template-id="${templateId}"></${htmlTag}>`;
}
