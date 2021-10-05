import HMR from "@roxi/routify/hmr";
import App from "./app.svelte";

const app = HMR(App, { target: document.body }, "routify-app");

export default app;
