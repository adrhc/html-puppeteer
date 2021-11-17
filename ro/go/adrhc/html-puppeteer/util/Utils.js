export function isUndefined(value) {
    return typeof value === "undefined";
}

/**
 * @param {ElemIdOrJQuery} elemIdOrJQuery
 * @return {jQuery<HTMLElement>} elemIdOrJQuery if *is* jQuery, $(`#${elemIdOrJQuery}`) if *is* string otherwise $(elemIdOrJQuery)
 */
export function jQueryOf(elemIdOrJQuery) {
    if (elemIdOrJQuery instanceof jQuery) {
        return elemIdOrJQuery;
    } else if (typeof elemIdOrJQuery === "string") {
        return $(`#${elemIdOrJQuery}`);
    } else {
        return $(elemIdOrJQuery);
    }
}

/**
 * @param {ElemIdOrJQuery} elemIdOrJQuery
 * @return {jQuery<HTMLElement>}
 */
export function $of(elemIdOrJQuery) {
    return jQueryOf(elemIdOrJQuery);
}
