class CssUtils {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param elemClassesActionConfigs {{$elem: jQuery<HTMLElement>, classes: string, remove: boolean}[]}
     */
    static switchClasses(elemClassesActionConfigs) {
        elemClassesActionConfigs.forEach(conf => {
            CssUtils.switchClassesByConfig(conf);
        })
    }

    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param elemClassesActionConfig {{$elem: jQuery<HTMLElement>, classes: string, remove: boolean}}
     */
    static switchClassesByConfig(elemClassesActionConfig) {
        CssUtils.switchClassesByParams(elemClassesActionConfig.$elem, elemClassesActionConfig.classes, elemClassesActionConfig.remove);
    }

    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param classes {string} class names separated by a space
     * @param remove {boolean} true = remove, false = add the classes listed in classes
     */
    static switchClassesByParams($elem, classes, remove) {
        if (remove) {
            $elem.removeClass(classes);
        } else {
            $elem.addClass(classes);
        }
    }
}