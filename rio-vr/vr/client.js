/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {VRInstance} from 'react-vr-web';
import {Module} from 'react-vr-web';
import * as THREE from 'three';
import {matrix} from '../config';
const {width, height} = matrix;
const z = -20;
const zDiff = 5;
const xBase = -30;
const yBase = -15;
const spacing = 1;
var generateParticles = function () {
    var geometry = new THREE.Geometry();
    for (var row = 0; row < height; row++) {
        for (var columm = 0; columm < width; columm++) {
            //Create a pixel for every coordinate in the grid
            const pixel = new THREE.Vector3((columm * spacing) + xBase, (row * spacing) + yBase, z);
            geometry.vertices.push(pixel);
            // geometry.colors.push(new THREE.Color("rgb(255,255,255)"));
            geometry.colors.push(new THREE.Color(Math.random() * 0xffffff));

            //Set z axis based on saturation
            const {s} = geometry.colors[geometry.vertices.length - 1].getHSL();
            geometry.vertices[geometry.vertices.length - 1].z = z + (zDiff * s);
        }
    }

    const material = new THREE.PointsMaterial({color: 0xffffff, vertexColors: THREE.VertexColors});
    return new THREE.Points(geometry, material);
};
function init(bundle, parent, options) {

    // Create a scene so we can add to it; otherwise the VRInstance creates one.
    const scene = new THREE.Scene();
    // Create Native Module so React context can modify native (Three.js) cube.
    const cubeModule = new PixelWallModule();

    const vr = new VRInstance(bundle, 'riovr', parent, {
        cursorVisibility: 'visible',
        nativeModules: [cubeModule],
        scene: scene,
    });

    const cube = generateParticles();
    cube.scale.y = -1;
    scene.add(cube);

    // Give cubeModule a handle to our cube.
    cubeModule.init(cube);

    vr.render = function (timestamp) {
        const {geometry} = cube;

        for (var pixel = 0; pixel < geometry.colors.length; pixel++) {
            const start = pixel * 3;

            if (cubeModule.colors) {
                //set color based on latest
                geometry.colors[pixel].set(`rgb(${cubeModule.colors[start]},${cubeModule.colors[start + 1]},${cubeModule.colors[start + 2]})`);

            } else {
                var {h,s,l} = geometry.colors[pixel].getHSL();
                geometry.colors[pixel].setHSL(h,s-.001,l);
            }
            //get saturation and add % of that to
            const {s} = geometry.colors[pixel].getHSL();
            geometry.vertices[pixel].z = z + (zDiff * s);

        }
        geometry.colorsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
        // Custom per-frame updates go here. Bounce the cube up and down.
    };

    // Begin the animation loop
    vr.start();
    return vr;
}

export default class PixelWallModule extends Module {
    // PixelWallModule is a React Native Module, which implements functionality
    // that can be called asynchronously across the React Native brige.

    // Constructor calls super() with one argument: module name.
    constructor() {
        super('PixelWallModule');
    }

    // Called directly after the module is created.
    init(cube) {
        this.cube = cube;
    }

    // Change the cube material color to the given value.
    // Called remotely by the PixelWallModule on the React side.
    set(colorArray) {
        this.colors = colorArray;
    }

}

window.ReactVR = {init};
