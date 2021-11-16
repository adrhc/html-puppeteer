import ChildrenCollection from "./ChildrenCollection.js";

export default class UniquePartsChildren extends ChildrenCollection {
    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    closeAndRemoveChild(partName) {
        const childrenByPartName = this.getChildByPartName(partName)
        if (!childrenByPartName) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        childrenByPartName.close();
        delete this.children[childrenByPartName.id];
        return true;
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     */
    getChildByPartName(partName) {
        return this.childrenArray.find(it => it.partName === partName);
    }
}