import {contentOfElemId, dataAttributesOf} from "../../util/DomUtils.js";
import GlobalConfig, {dataComponentIdOf, dataOwnerOf, dataPartOf, dataTypeOf} from "../../util/GlobalConfig.js";

/**
 * @typedef {Bag} SeatAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka shell)
 * @property {string=} type
 * @property {string=} htmlTag
 */
/**
 * @typedef {Object} ChildShellTemplateOptions
 * @property {string=} shellTemplate is the shell's HTML containing the data-type and data-part
 * @property {string=} shellTemplateId
 * @property {string=} shellOccupantTemplateId is a shortcut for SeatAttributes.templateId
 * @property {string=} shellOccupantHtmlTag is a shortcut for SeatAttributes.htmlTag
 * @property {string=} shellOccupantType is a shortcut for SeatAttributes.type
 * @property {SeatAttributes=} childSeatAttributes
 */
/**
 * @param {string} parentId
 * @param {ChildShellTemplateOptions} options
 */
export default function shellTemplateOf(parentId, {
    shellTemplate,
    shellTemplateId,
    shellOccupantTemplateId,
    shellOccupantHtmlTag,
    shellOccupantType,
    childSeatAttributes = {
        templateId: shellOccupantTemplateId,
        htmlTag: shellOccupantHtmlTag,
        type: shellOccupantType
    }
}) {
    return shellTemplate ?? createSeatTemplate(parentId, shellTemplateId, childSeatAttributes);
}

/**
 * @param {string} parentId
 * @param {string=} shellTemplateId
 * @param {SeatAttributes=} childSeatAttributes
 * @protected
 */
function createSeatTemplate(parentId, shellTemplateId, childSeatAttributes) {
    if (shellTemplateId) {
        return contentOfElemId(shellTemplateId);
    } else {
        return templateFromSeatAttributes(parentId, childSeatAttributes);
    }
}

/**
 * @param {SeatAttributes=} childSeatAttributes
 * @param {string} parentId
 * @return {string}
 * @protected
 */
function templateFromSeatAttributes(parentId, {templateId, htmlTag = "div", type = "simple", ...rest}) {
    return `<${htmlTag} ${dataTypeOf(type)} ${dataOwnerOf(parentId)} ${dataPartOf(`{{${GlobalConfig.PART}}}`)} ${dataComponentIdOf(`{{${GlobalConfig.COMPONENT_ID}}}`)} data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
}

/**
 * @param {ChildShellTemplateOptions} options
 */
export function shellTemplateOptionsAreEmpty({
                                                 shellTemplate,
                                                 shellTemplateId,
                                                 shellOccupantTemplateId,
                                                 shellOccupantHtmlTag,
                                                 shellOccupantType,
                                                 childSeatAttributes = {
                                                     templateId: shellOccupantTemplateId,
                                                     htmlTag: shellOccupantHtmlTag,
                                                     type: shellOccupantType
                                                 }
                                             }) {
    return shellTemplate == null && shellTemplateId == null && childSeatAttributes.templateId == null;
}