import Projector from 'three/examples/js/renderers/Projector.js';
import CanvasRenderer from 'three/examples/js/renderers/CanvasRenderer.js';
import TWEEN from 'tween.js';

class chipParticleSystem {
    constructor(containerDiv) {
        this.container = containerDiv;
        this.container.addEventListener('click', event => {
            const link = document.getElementById('main-cta');
            window.location.href = link.href;
        });
        this.init3dEnvironment();
        window.addEventListener('resize', event => {
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.camera.maxDimention = Math.max(this.container.clientWidth, this.container.clientHeight);
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
        });
        this.particles = this.makeParticles();
        this.particles.forEach(particle => {
            this.scene.add(particle);
            this.initParticleTween(particle)
        });
        this.animate();
    }

    init3dEnvironment() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const clientHasWebGL = gl && gl instanceof WebGLRenderingContext;
        if (clientHasWebGL) {
            this.renderer = new THREE.WebGLRenderer({
                alpha: true
            });
        } else {
            this.renderer = new THREE.CanvasRenderer({
                alpha: true
            });
        }
        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 4000);
        this.camera.maxDimention = Math.max(this.container.clientWidth, this.container.clientHeight);
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.position.z = 500;
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.updateProjectionMatrix();
    }

    makeParticles() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(0, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 64, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        const particles = [];
        for (var i = 0; i < 512; i++) {
            const material = new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(canvas),
                blending: THREE.AdditiveBlending,
                opacity: 0,
            });
            const particle = new THREE.Sprite(material);
            const vector = new THREE.Vector3();
            vector.setX(this.getRandomNumberInRange(-2000, 2000));
            vector.setY(this.getRandomNumberInRange(-1000, 1000));
            vector.setZ(this.getRandomNumberInRange(-2000, 500));
            particle.start = vector.clone().setLength(this.getRandomNumberInRange(500, 1000));
            particle.end = vector.clone().setLength(this.getRandomNumberInRange(1500, 2000));
            particle.position.fromArray(particle.start.toArray());
            particle.scale.x = particle.scale.y = this.getRandomNumberInRange(7, 21);
            particles.push(particle);
        }
        return particles;
    }

    getRandomNumberInRange(startRange, endRange) {
        return Math.random() * (endRange - startRange - 1) + startRange;
    }

    initParticleTween(particle) {
        const delay = this.getRandomNumberInRange(0, 10000);
        const tween = new TWEEN.Tween(particle.position)
            .delay(delay)
            .to(particle.end, 10000)
            .start();
        new TWEEN.Tween(particle.material)
            .delay(delay)
            .to({
                opacity: 1,
            }, 500)
            .start();
        tween.onComplete(() => {
            particle.material.opacity = 0;
            particle.position.fromArray(particle.start.toArray());
            this.initParticleTween(particle);
        });
    }

    // the animate funciton runs 60fps and renders
    // the objects as they move & interact
    animate(time) {
        requestAnimationFrame(this.animate.bind(this));
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', event => {
    const ps = new chipParticleSystem(document.getElementById('particle-system'));
});

export default chipParticleSystem;
