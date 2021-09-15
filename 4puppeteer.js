import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {createDebuggerConfiguration} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    PUPPETEER.animate(createDebuggerConfiguration());
})