export function isUndefined(value) {
    return typeof value === "undefined";
}

/**
 * @param {ElemIdOrJQuery} elemIdOrJQuery
 * @return {jQuery<HTMLElement>} elemIdOrJQuery if *is* jQuery, $(`#${elemIdOrJQuery}`) if *is* string otherwise $(elemIdOrJQuery)
 */
export function jQueryOf(elemIdOrJQuery) {
    let $elem;
    if (elemIdOrJQuery instanceof jQuery) {
        $elem = elemIdOrJQuery;
    } else if (typeof elemIdOrJQuery === "string") {
        $elem = $(`#${elemIdOrJQuery}`);
    } else {
        $elem = $(elemIdOrJQuery);
    }
    return $elem.length ? $elem : undefined;
}

/**
 * @param {ElemIdOrJQuery} elemIdOrJQuery
 * @return {jQuery<HTMLElement>}
 */
export function $of(elemIdOrJQuery) {
    return jQueryOf(elemIdOrJQuery);
}
