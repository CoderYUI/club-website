import * as THREE from "three";
import imagesLoaded from "imagesloaded";
// @ts-ignore
import vertex from "./shaders/vertex.glsl";
// @ts-ignore
import fragment from "./shaders/fragment.glsl";
import gsap from "gsap";

export default class SimpleThree {
    scene: THREE.Scene;
    container: HTMLElement;
    width: number;
    height: number;
    cameraDistance: number;
    fov: number;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    time: number;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    currentHovered: any;
    clock: THREE.Clock;
    images: HTMLElement[];
    videos: HTMLVideoElement[];
    material!: THREE.ShaderMaterial;
    materialArr: THREE.ShaderMaterial[] = [];
    imageStore: any[] = [];

    constructor(options: { dom: HTMLElement }) {
        console.log('Initializing Simple Three.js component');
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.cameraDistance = 5;
        this.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.width / this.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, this.cameraDistance);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        this.time = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);
        this.currentHovered = null;
        this.clock = new THREE.Clock();

        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.images = [...document.querySelectorAll("img[data-webgl-media]")] as HTMLElement[];
            this.videos = [...document.querySelectorAll("video.project_video")] as HTMLVideoElement[];

            console.log(`Found ${this.images.length} images and ${this.videos.length} videos`);

            this.addImages();
            this.mouseMovement();
            this.addClickEvents();
            this.resize();
            this.setupResize();
            this.render();
        }, 100);
    }

    mouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                let obj = intersects[0].object as THREE.Mesh;
                (obj.material as THREE.ShaderMaterial).uniforms.uHover.value = intersects[0].uv;

                if (this.currentHovered !== obj) {
                    if (this.currentHovered) {
                        gsap.to((this.currentHovered.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                            duration: 0.5,
                            value: 0,
                            ease: "circ.inOut",
                        });
                        this.currentHovered.userData.hovered = false;
                    }

                    obj.userData.hovered = true;
                    gsap.to((obj.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                        duration: 0.5,
                        value: 1,
                        ease: "circ.inOut",
                    });
                    this.currentHovered = obj;
                }
            } else {
                if (this.currentHovered) {
                    gsap.to((this.currentHovered.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                        duration: 0.5,
                        value: 0,
                        ease: "circ.inOut",
                    });
                    this.currentHovered.userData.hovered = false;
                    this.currentHovered = null;
                }
            }
        });
    }

    addClickEvents() {
        // Add click event to the container
        this.container.addEventListener('click', (event) => {
            // Update mouse position based on click event
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                let obj = intersects[0].object as THREE.Mesh;
                console.log('Image clicked!');
                // Just log for now - we can add fullscreen functionality later
            }
        });
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: null },
                uImage1: { value: null },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                uIsFullScreen: { value: 0 },
                aspect: { value: new THREE.Vector2(1, 1) },
                uProgress: { value: 0 },
                uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
                uTextureSize: { value: new THREE.Vector2(1, 1) },
                uResolution: { value: new THREE.Vector2(this.width, this.height) },
                uQuadSize: { value: new THREE.Vector2(1, 1) },
                uIsMobile: { value: window.innerWidth <= 768 ? 1.0 : 0.0 }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.materialArr = [];

        // Just use the first image for testing
        if (this.images.length > 0 && this.videos.length > 0) {
            const img = this.images[0];
            const video = this.videos[0];
            
            let imgBounds = img.getBoundingClientRect();

            video.play().catch(error => {
                console.error(`Video playback failed for ${video.src}:`, error);
            });

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.colorSpace = THREE.SRGBColorSpace;

            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            texture.colorSpace = THREE.SRGBColorSpace;

            let imgGeo = new THREE.PlaneGeometry(1, 1, 50, 50);

            let imgMat = this.material.clone();
            imgMat.uniforms.uImage.value = texture;
            imgMat.uniforms.uImage1.value = videoTexture;
            imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1);
            imgMat.uniforms.uTextureSize.value = new THREE.Vector2(imgBounds.width, imgBounds.height);
            imgMat.uniforms.uQuadSize.value = new THREE.Vector2(imgBounds.width, imgBounds.height);

            this.materialArr.push(imgMat);

            let imgMesh = new THREE.Mesh(imgGeo, imgMat);
            imgMesh.scale.set(imgBounds.width, imgBounds.height, 1);
            imgMesh.userData = { isFullScreen: false, hovered: false };
            this.scene.add(imgMesh);

            this.imageStore = [{
                img: img,
                mesh: imgMesh,
                width: imgBounds.width,
                height: imgBounds.height,
            }];
        }
    }

    render() {
        this.time = this.clock.getElapsedTime();
        
        this.materialArr.forEach(material => {
            (material as THREE.ShaderMaterial).uniforms.uTime.value = this.time;
        });
        this.renderer.render(this.scene, this.camera);
        
        // Continue the render loop
        requestAnimationFrame(this.render.bind(this));
    }
}