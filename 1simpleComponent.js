import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";
import {withDebuggerConfigurator} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    new SimpleComponent(withDebuggerConfigurator({elemIdOrJQuery: "component"}))
        .render({text: "Hello puppeteer!"});
})