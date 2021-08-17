import * as Utils from "Utils";
import MainView from "./MainView";

export const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
const loadingBar = document.getElementById("loading-bar");

// loading bar api
export const updateLoading = (loaded: number) => {
    Utils.updateLoading(loadingBar, loaded);
};

export const toggleCanvas = (show: boolean) => {
    if (show && !canvas.classList.contains("show")) {
        canvas.classList.add("show");
    } else if (!show && canvas.classList.contains("show")) {
        canvas.classList.remove("show");
    }
};

// get debug state from url
const urlParams = new URLSearchParams(window.location.search);
const debug = process.env.NODE_ENV === "development" && urlParams.get("debug") === "true";

// initialize view
const view = new MainView(canvas, debug);

// main loop
const update = (time: number): void => {
    view.update(time);
    requestAnimationFrame(update);
};

// resize renderer in view
window.addEventListener("resize", () => {
    view.onWindowResize(window.innerWidth, window.innerHeight);
});

update(0);
