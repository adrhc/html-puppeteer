import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    PUPPETEER.animate(withDebugger());
})