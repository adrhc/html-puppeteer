class CssUtils {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param classesToAddOrRemove {string} class names separated by a space
     * @param remove {boolean} true = remove, false = add the classes listed in classesToAddOrRemove
     */
    static switchClasses($elem, classesToAddOrRemove, remove) {
        if (remove) {
            $elem.removeClass(classesToAddOrRemove);
        } else {
            $elem.addClass(classesToAddOrRemove);
        }
    }
}