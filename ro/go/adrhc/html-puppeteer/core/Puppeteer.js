import GlobalConfig from "../util/GlobalConfig.js";
import {createByType} from "./ComponentsFactories.js";

class Puppeteer {
    /**
     * @param {{}=} componentsOptions
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @param {boolean=} dontRender
     * @param {boolean=} alwaysReturnArray
     * @return {AbstractContainerComponent|AbstractContainerComponent[]}
     */
    animate(componentsOptions, dontRender, parentComponentElem, alwaysReturnArray) {
        const components = this.componentsOf(parentComponentElem, componentsOptions);
        console.log("[Puppeteer.animate] components.length:", components.length);
        if (!dontRender) {
            this.renderComponents(components);
        }
        if (components.length === 1 && !alwaysReturnArray) {
            return components[0];
        }
        return components;
    }

    /**
     * @param {jQuery<AbstractContainerComponent>} $components
     * @protected
     */
    renderComponents($components) {
        $components.each((index, comp) => comp.render());
    }

    /**
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @param {{}} componentsOptions
     * @return {AbstractContainerComponent|AbstractContainerComponent[]}
     * @protected
     */
    componentsOf(parentComponentElem, componentsOptions) {
        return this.$componentElementsOf(parentComponentElem)
            .map((index, el) => {
                const $el = $(el);
                const type = this.componentTypeOf($el);
                return this.instanceOf(type, $el, componentsOptions);
            });
    }

    /**
     * @param {jQuery<HTMLElement>=} parentComponentElem
     * @return {jQuery}
     * @protected
     */
    $componentElementsOf(parentComponentElem) {
        return $(`[data-${GlobalConfig.DATA_TYPE}]`, parentComponentElem);
    }

    /**
     * @param {string} type
     * @param {jQuery<HTMLElement>} $el
     * @param {{}} componentOptions
     * @return {AbstractContainerComponent}
     * @protected
     */
    instanceOf(type, $el, componentOptions = {}) {
        return createByType(type, {elemIdOrJQuery: $el, ...componentOptions});
    }

    /**
     * @param {jQuery<HTMLElement>} $el
     * @return {string}
     * @protected
     */
    componentTypeOf($el) {
        return $el.data(GlobalConfig.DATA_TYPE);
    }
}

const PUPPETEER = new Puppeteer();
export default PUPPETEER;