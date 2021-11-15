/**
 * @typedef {{[key:string]:*}} Bag
 */

/**
 * @typedef {function(c: AbstractComponent): *} ComponentBasedProviderFn
 */

/**
 * @typedef {{[key: string]: (string[]|string|number[]|number|boolean[]|boolean|ComponentBasedProviderFn|null|undefined)}} DataAttributes
 * @property {string|null|undefined} initialState
 */

/**
 * @typedef {string|jQuery<HTMLElement>} ElemIdOrJQuery
 */

/**
 * @typedef {function(previousPartName?: OptionalPartName, newPart?: *, newPartName?: OptionalPartName, dontRecordChanges?: boolean)} ReplacePartFn
 */

/**
 * @typedef {function(parts?: {[name: PartName]: *})} ReplacePartsFn
 */

/**
 * @typedef {function(options: AbstractComponentOptions): StateHolder} StateHolderProviderFn
 */

/**
 * @typedef {function(options: AbstractContainerComponent): ChildrenComponents} ChildrenComponentsProviderFn
 */

/**
 * @typedef {function(options: AbstractComponent): StateChangesHandler} StateChangesHandlerProviderFn
 */

/**
 * @typedef {function(options: ComponentOptions)} ComponentOptionsConsumer
 */

/**
 * @typedef {function(initialState: *): StateInitializer} StateInitializerProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent): EventsBinder} EventsBinderProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */

/**
 * @typedef {function(state: StateHolder)} StateUpdaterFn
 */

/**
 * @typedef {ComponentConfigField | DynamicContainerComponentOptions & DebuggerOptions} ComponentOptions
 */

/**
 * @typedef {{[key: string]: ComponentOptions}} SpecificComponentOptions
 */

/**
 * @typedef {ComponentOptions & SpecificComponentOptions} CreateComponentParams
 */

/**
 * @param {EventsBinder} eventsBinder
 * @return {EventsBinderProviderFn}
 */
export function eventsBinderProviderFnOf(eventsBinder) {
    return component => {
        if (component) {
            eventsBinder.component = component;
        }
        return eventsBinder;
    }
}