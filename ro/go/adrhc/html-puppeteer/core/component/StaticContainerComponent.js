import SimpleContainerComponent from "./SimpleContainerComponent.js";

export default class StaticContainerComponent extends SimpleContainerComponent {
    /**
     * No children will be dynamically created hence there's no need for a shell template.
     *
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, ignoreShellTemplateOptions: true});
    }
}