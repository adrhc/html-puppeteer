/**
 * The (e.g. row) position can change to a specific one (when index is specified)
 * or a relative one (when other than index positioning property is specified).
 */
class PositionUtils {
    static LAST_ELEMENT_INDEX = -1;
    /**
     * evaluation order should be:
     * index === 0, beforeRowId, afterRowId, append (when append != null), index
     *
     * @type {string[]}
     */
    static POSITIONING_PROPERTIES = ["index", "beforeRowId", "afterRowId", "append"];

    /**
     * Check whether positioning properties are not empty and valid.
     *
     * The row position can change to a specific one (when index is specified) or a relative one
     * (when other than index is specified). We should never change the position with the index
     * (other than 0 or PositionUtils.LAST_ELEMENT_INDEX) because it's not reliable; instead,
     * the other positioning fields should be used.
     *
     * about "append?: (boolean|undefined)" see the link below:
     * https://stackoverflow.com/questions/25773222/how-to-annotate-anonymous-object-with-optional-property-in-jsdoc
     *
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: (boolean|undefined)}} positioningProperties
     * @return true
     */
    static arePositioningPropertiesValid(positioningProperties) {
        return PositionUtils.areAllButIndexValid(positioningProperties) || positioningProperties.index === 0
            || positioningProperties.index === PositionUtils.LAST_ELEMENT_INDEX;
    }

    /**
     * @param {{index?: number, beforeRowId?: number, afterRowId?: number, append?: (boolean|undefined)}} positioningProperties
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