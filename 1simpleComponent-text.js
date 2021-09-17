import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    new SimpleComponent(withDebugger({elemIdOrJQuery: "component"}))
        .render({text: "Hello puppeteer!"});
})