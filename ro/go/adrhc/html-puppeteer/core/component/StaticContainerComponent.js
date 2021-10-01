import SimpleContainerComponent from "./SimpleContainerComponent.js";

/**
 * No children will be dynamically created hence there's no need for shell template.
 */
export default class StaticContainerComponent extends SimpleContainerComponent {
    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, ignoreShellTemplateOptions: true});
    }
}