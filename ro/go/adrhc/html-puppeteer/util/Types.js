/**
 * @typedef {{[key:string]:*}} Bag
 */

/**
 * @typedef {{[key: string]: (string|number|boolean|null|undefined)}} DataAttributes
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
 * @typedef {function(options: AbstractComponent): (StateHolder)} StateHolderProviderFn
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
 * @typedef {function(): EventsBinder} EventsBinderProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */

/**
 * @typedef {ComponentConfigField | DynamicContainerComponentOptions & DebuggerOptions} ComponentOptions
 */
