uniform float time;

void main() {
    gl_FragColor = vec4(0.0, 0.0, (sin(time / 1000.0) + 1.0) / 2.0, 1.0);
}
