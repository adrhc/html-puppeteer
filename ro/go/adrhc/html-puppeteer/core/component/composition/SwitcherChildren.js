import ChildrenComponents from "./ChildrenComponents.js";
import GlobalConfig from "../../../util/GlobalConfig.js";

export default class SwitcherChildren extends ChildrenComponents {
    /**
     * @param {string|number|boolean} name
     * @return {AbstractComponent}
     */
    getChildByActiveName(name) {
        return this._get1thChildrenHavingConfig(GlobalConfig.ACTIVE_CHILD_NAME, name) ?? this.getChildByPartName(name);
    }

    /**
     * @param {string|number|boolean} property
     * @param {string|number|boolean} value
     * @return {AbstractComponent}
     */
    _get1thChildrenHavingConfig(property, value) {
        return this.childrenArray.find(it => it.config?.[property] === value);
    }
}