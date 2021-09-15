import {createDebuggerConfiguration} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";
import SimpleComponent from "./ro/go/adrhc/html-puppeteer/core/SimpleComponent.js";
import {coalesce} from "./ro/go/adrhc/html-puppeteer/util/ObjectUtils.js";

$(() => {
    new SimpleComponent(coalesce(
        {elemIdOrJQuery: "component"},
        createDebuggerConfiguration())
    ).render();
})