import ComponentConfigurator from "./ComponentConfigurator.js";
import StateChangesHandlersInvoker from "../../state-processor/StateChangesHandlersInvoker.js";
import ValuesStateInitializer from "../ValuesStateInitializer.js";
import {dataOf} from "../../../util/DomUtils.js";
import PartialStateHolder from "../../state/PartialStateHolder.js";

export default class DefaultComponentConfigurator extends ComponentConfigurator {
    /**
     * @type {DataAttributes}
     */
    dataAttributes;
    /**
     * @type {AbstractComponentOptions}
     */
    options;

    /**
     * @param {AbstractComponentOptions} options
     */
    constructor(options = {}) {
        super();
        this.options = options;
        this.dataAttributes = dataOf(this.options.elemIdOrJQuery) ?? {};
        this.config = _.defaults(this.options, this.dataAttributes);
    }

    /**
     * Sets the component's fields (e.g. stateHolder) to sensible defaults.
     *
     * @param {AbstractComponent} component
     */
    configure(component) {
        this._setOptionsDataAttributesAndConfig(component);
        component.stateHolder = this.config.stateHolder ?? new PartialStateHolder(this.config);
        component.stateChangesHandlersInvoker =
            this.config.stateChangesHandlersInvoker ?? new StateChangesHandlersInvoker(this.config);
        this._setAndConfigureStateInitializer(component);
        this._setAndConfigureEventsBinder(component);
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setOptionsDataAttributesAndConfig(component) {
        component.dataAttributes = this.dataAttributes;
        component.options = this.options;
        component.config = this.config;
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setAndConfigureEventsBinder(component) {
        component.eventsBinder = this.config.eventsBinder;
        if (component.eventsBinder) {
            component.eventsBinder.component = component;
        }
    }

    /**
     * @param {AbstractComponent} component
     * @protected
     */
    _setAndConfigureStateInitializer(component) {
        component.stateInitializer = this.config.stateInitializer;
        if (component.stateInitializer == null && this.config.initialState != null) {
            component.stateInitializer = new ValuesStateInitializer(this.config.initialState);
        }
    }
}
