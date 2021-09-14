import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";

$(() => {
    withDebugger(new SimpleComponent({elemIdOrJQuery: "component"})).render();
})