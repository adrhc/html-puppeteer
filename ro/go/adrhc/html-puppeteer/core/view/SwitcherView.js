import SimpleTemplateView from "./SimpleTemplateView.js";

/**
 * @typedef {AbstractTemplateViewOptions} SwitcherViewOptions
 * @property {string=} statusEmptyClass
 */
export default class SwitcherView extends SimpleTemplateView {
    /**
     * @param {string=} previousStatus
     * @param {string=} nextStatus
     */
    switch(previousStatus, nextStatus) {
        this.$renderElem.removeClass(previousStatus);
        this.$renderElem.addClass(nextStatus);
    }
}