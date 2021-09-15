import {withDebuggerConfigurator} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    new SimpleComponent(withDebuggerConfigurator({elemIdOrJQuery: "component"})).render();
})