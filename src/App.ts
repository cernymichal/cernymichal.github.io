/*

Entry from Webpack, generates Three.js View

*/

import View from "./webgl/View";

class App {
    private view: View;
    private debug: boolean;

    constructor(debug: boolean) {
        this.debug = debug;

        const canvasBox = <HTMLCanvasElement>(
            document.getElementById("webgl-canvas")
        );
        this.view = new View(canvasBox, this.debug);

        window.addEventListener("resize", this.resize);
        this.update(0);
    }

    private resize = (): void => {
        this.view.onWindowResize(window.innerWidth, window.innerHeight);
    };

    private update = (t: number): void => {
        this.view.update(t / 1000);
        requestAnimationFrame(this.update);
    };
}

const urlParams = new URLSearchParams(window.location.search);
const debug =
    process.env.NODE_ENV === "development" && urlParams.get("debug") === "true";

const app = new App(debug);
