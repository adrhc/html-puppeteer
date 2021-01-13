class CssUtils {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param classesToRemove {string} class names separated by a space
     * @param classesToAdd {string} class names separated by a space
     * @param reversedBehaviour {boolean} means to add the classesToRemove and remove the classesToAdd
     */
    static addRemoveClasses($elem, classesToRemove, classesToAdd, reversedBehaviour) {
        if (reversedBehaviour) {
            if (classesToRemove) {
                $elem.addClass(classesToRemove);
            }
            if (classesToAdd) {
                $elem.removeClass(classesToAdd);
            }
        } else {
            if (classesToAdd) {
                $elem.addClass(classesToAdd);
            }
            if (classesToRemove) {
                $elem.removeClass(classesToRemove);
            }
        }
    }
}