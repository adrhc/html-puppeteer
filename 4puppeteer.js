import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {withDebuggerConfigurator} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    PUPPETEER.animate(withDebuggerConfigurator());
})