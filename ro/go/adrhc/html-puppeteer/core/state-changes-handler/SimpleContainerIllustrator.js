import ComponentIllustrator from "./ComponentIllustrator.js";
import {$childrenRoomOf} from "../Puppeteer.js";
import {dataPart, dataPartSelectorOf, dataType} from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {encodeHTML, templateTextOf} from "../../util/HtmlUtils.js";

/**
 * @typedef {Bag} ChildrenFrameAttributes
 * @property {string=} templateId
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {ComponentIllustratorOptions & AbstractTemplateViewOptions} SimpleContainerIllustratorOptions
 * @property {string|jQuery<HTMLElement>=} $childrenRoom is the container's element having [data-children=""]
 * @property {string=} frameTemplate
 * @property {string=} frameTemplateId
 * @property {boolean=} newChildrenGoLast
 * @property {boolean=} dontRemoveChildren
 * @property {ChildrenFrameAttributes=} childrenFrameAttributes
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $childrenRoom;
    /**
     * @type {boolean}
     */
    dontRemoveChildren;
    /**
     * @type {string}
     */
    frameTemplate;
    /**
     * @type {string}
     */
    place;

    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {SimpleContainerIllustratorOptions} options.restOfOptions
     */
    constructor({
                    $childrenRoom,
                    frameTemplate,
                    frameTemplateId,
                    newChildrenGoLast,
                    dontRemoveChildren,
                    childrenFrameAttributes = {},
                    ...restOfOptions
                }) {
        super(restOfOptions);
        this.$childrenRoom = $childrenRoom ?? $childrenRoomOf(restOfOptions.elemIdOrJQuery);
        this.place = (newChildrenGoLast ?? false) ? "append" : "prepend";
        this.dontRemoveChildren = dontRemoveChildren ?? false;
        this.frameTemplate = frameTemplate ?? this._createTemplate(frameTemplateId, childrenFrameAttributes);
    }

    /**
     * @param {string=} frameTemplateId
     * @param {ChildrenFrameAttributes=} childrenFrameAttributes
     * @protected
     */
    _createTemplate(frameTemplateId, {templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        if (frameTemplateId) {
            return templateTextOf(frameTemplateId);
        } else {
            /*const dataAttributes = Object.keys(rest)
                .map(key => [key, `data-${_.kebabCase(key)}`])
                .reduce((prev, curr) => {
                    prev[curr[1]] = rest[curr[0]];
                    return prev;
                }, {});*/
            const dataAttributes = Object.entries(rest).map(([key, value]) => `data-${_.kebabCase(key)}="${encodeHTML(value)}"`).join(" ");
            // {{this}} will be the part name
            return `<${htmlTag} ${dataPart()}="{{this}}" ${dataType()}="${componentType}" data-template-id="${templateId}" ${dataAttributes}></${htmlTag}>`;
        }
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        if (this.dontRemoveChildren) {
            return;
        }
        this.$childrenRoom.children(dataPartSelectorOf(partStateChange.previousPartName)).remove();
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        if (this._partElemExists(partStateChange.newPartName)) {
            return;
        }
        this.$childrenRoom[this.place](generateHtml(this.frameTemplate, partStateChange.newPartName));
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.partRemoved(partStateChange);
        this.partCreated(partStateChange);
    }

    /**
     * @param {PartName} name
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$partByName(name) {
        return this.$childrenRoom.children(dataPartSelectorOf(name));
    }

    /**
     * @param {string} partName
     * @return {boolean}
     * @protected
     */
    _partElemExists(partName) {
        return !!this._$partByName(partName).length;
    }
}
