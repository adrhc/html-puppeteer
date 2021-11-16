import ChildrenCollection from "./ChildrenCollection.js";

export default class DuplicatedPartsChildren extends ChildrenCollection {
    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    getChildByPartName(partName) {
        return this.childrenArray.filter(it => it.partName === partName);
    }
}