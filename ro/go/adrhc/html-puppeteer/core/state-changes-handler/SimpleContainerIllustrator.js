import ChildrenRoomView from "../view/ChildrenRoomView.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import ComponentIllustrator from "./ComponentIllustrator.js";

/**
 * @typedef {ComponentIllustratorOptions & ChildrenRoomViewOptions} SimpleContainerIllustratorOptions
 * @property {string=} parentId
 */
/**
 * @template SCT, SCP
 * @extends {ComponentIllustrator}
 * @extends {PartialStateChangesHandler}
 */
export default class SimpleContainerIllustrator extends ComponentIllustrator {
    /**
     * @type {ChildrenRoomView}
     */
    childrenRoomView;

    /**
     * @param {SimpleContainerIllustratorOptions} options
     * @param {ViewValuesTransformerFn} options.viewValuesTransformerFn
     * @param {ComponentIllustratorOptions | ChildrenRoomViewOptions} options.restOfOptions
     */
    constructor({viewValuesTransformerFn, ...restOfOptions}) {
        super(_.defaults(restOfOptions, {
            viewValuesTransformerFn: viewValuesTransformerFn ??
                ((values) => ({...values, [GlobalConfig.OWNER_ATTR]: restOfOptions.parentId}))
        }));
        this.childrenRoomView = new ChildrenRoomView(restOfOptions);
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    created(stateChange) {
        super.created(stateChange);
        this.childrenRoomView.parentUpdated()
    }

    /**
     * @param {StateChange<SCT>} stateChange
     */
    replaced(stateChange) {
        super.replaced(stateChange);
        this.childrenRoomView.parentUpdated()
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRemoved(partStateChange) {
        this.childrenRoomView.remove(partStateChange.previousPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partCreated(partStateChange) {
        this.childrenRoomView.create(partStateChange.newPartName);
    }

    /**
     * @param {PartStateChange<SCT, SCP>} partStateChange
     */
    partRelocated(partStateChange) {
        this.childrenRoomView.remove(partStateChange.previousPartName);
        this.childrenRoomView.create(partStateChange.newPartName);
    }
}
