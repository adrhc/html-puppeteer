import ComponentIllustrator from "./ComponentIllustrator.js";
import {$childrenRoomOf} from "../Puppeteer.js";
import {dataPart, dataPartSelectorOf, dataType} from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {dataAttributesOf, templateTextOf} from "../../util/HtmlUtils.js";

/**
 * @typedef {Bag} ChildrenFrameAttributes
 * @property {string=} templateId
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {ComponentIllustratorOptions & AbstractTemplateViewOptions} SimpleContainerIllustratorOptions
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
     * @type {string|jQuery<HTMLElement>}
     */
    parentIdOrJQuery;
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
        this.parentIdOrJQuery = restOfOptions.elemIdOrJQuery;
        this.place = (newChildrenGoLast ?? false) ? "append" : "prepend";
        this.dontRemoveChildren = dontRemoveChildren ?? false;
        this.frameTemplate = frameTemplate ?? this._createTemplate(frameTemplateId, childrenFrameAttributes);
    }

    /**
     * @param {StateChange} stateChange
     */
    created(stateChange) {
        super.created(stateChange);
        this.$childrenRoom = $childrenRoomOf(this.parentIdOrJQuery);
    }

    /**
     * @param {StateChange} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
        this.$childrenRoom = $childrenRoomOf(this.parentIdOrJQuery);
    }

    /**
     * @param {string=} frameTemplateId
     * @param {ChildrenFrameAttributes=} childrenFrameAttributes
     * @protected
     */
    _createTemplate(frameTemplateId, childrenFrameAttributes) {
        if (frameTemplateId) {
            return templateTextOf(frameTemplateId);
        } else {
            return this._templateFromChildrenFrameAttributes(childrenFrameAttributes);
        }
    }

    /**
     * @param {ChildrenFrameAttributes=} childrenFrameAttributes
     * @return {string}
     * @protected
     */
    _templateFromChildrenFrameAttributes({templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        // {{this}} will be the part name when the kid's frame will be created
        return `<${htmlTag} ${dataPart()}="{{this}}" ${dataType()}="${componentType}" data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
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
