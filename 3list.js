import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    new SimpleComponent(withDebugger({elemIdOrJQuery: "component"})).render();
})