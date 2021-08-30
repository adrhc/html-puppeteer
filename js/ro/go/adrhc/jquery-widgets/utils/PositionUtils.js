/**
 * The (e.g. row) position can change to a specific one (when index is specified)
 * or a relative one (when other than index positioning property is specified).
 */
class PositionUtils {
    static LAST_ELEMENT_INDEX = -9;
    /**
     * evaluation order should be:
     * index === 0, beforeRowId, afterRowId, append (when append != null), index
     *
     * @type {string[]}
     */
    static POSITIONING_PROPERTIES = ["beforeRowId", "afterRowId", "append", "index"];

    /**
     * @param {{beforeRowId?: number, afterRowId?: number, append?: (boolean|undefined)}} positioningProperties
     * @return true
     */
    static areAllButIndexValid(positioningProperties = {}) {
        return PositionUtils.POSITIONING_PROPERTIES.filter(p => p !== "index" && positioningProperties[p] != null).length === 1;
    }

    /**
     * @param {{index?: undefined|number, beforeRowId?: undefined|number, afterRowId?: undefined|number, append?: undefined|boolean}=} positioningProperties
     * @param {{}} target
     */
    static copyPositioningProperties(positioningProperties, target) {
        PositionUtils.POSITIONING_PROPERTIES.forEach(it => target[it] = positioningProperties?.[it]);
    }

    /**
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: (boolean|undefined)}} positioningProperties
     * @return boolean
     */
    static areAllPositioningPropertiesEmpty(positioningProperties = {}) {
        return !PositionUtils.POSITIONING_PROPERTIES.find(p => positioningProperties[p] != null);
    }
}