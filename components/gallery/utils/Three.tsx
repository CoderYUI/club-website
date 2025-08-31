import * as THREE from "three";
import imagesLoaded from "imagesloaded";
// @ts-ignore
import vertex from "../shaders/vertex.glsl";
// @ts-ignore
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default class Three {
    scene: THREE.Scene;
    container: HTMLElement;
    width: number;
    height: number;
    cameraDistance: number;
    fov: number;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    time: number;
    currentScroll: number;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    currentHovered: any;
    clock: THREE.Clock;
    images: HTMLElement[];
    videos: HTMLVideoElement[];
    workElement: HTMLElement | null;
    projectsElement: HTMLElement | null;
    infoH1s: NodeListOf<HTMLElement>;
    scroll: any;
    material!: THREE.ShaderMaterial;
    materialArr: THREE.ShaderMaterial[] = [];
    imageStore: any[] = [];

    constructor(options: { dom: HTMLElement }) {
        try {
            console.log('Initializing Three.js component');
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
            // physicallyCorrectLights has been removed in newer Three.js versions
            // this.renderer.physicallyCorrectLights = true;
            // Updated for Three.js compatibility - sRGBEncoding is deprecated
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            this.container.appendChild(this.renderer.domElement);

            this.time = 0;
            this.currentScroll = 0;

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2(0, 0);

            this.currentHovered = null;

            this.clock = new THREE.Clock();

            // Wait for DOM to be ready
            setTimeout(() => {
                this.images = [...document.querySelectorAll("img[data-webgl-media]")] as HTMLElement[];
                this.videos = [...document.querySelectorAll("video.project_video")] as HTMLVideoElement[];

                console.log(`Found ${this.images.length} images and ${this.videos.length} videos`);

                // Preloader elements
                this.workElement = document.querySelector('.work p');
                this.projectsElement = document.querySelector('.projects');
                this.infoH1s = document.querySelectorAll('.info h1') as NodeListOf<HTMLElement>;

                console.log('DOM elements:', {
                    workElement: this.workElement,
                    projectsElement: this.projectsElement,
                    infoH1s: this.infoH1s.length
                });

                // Always initialize the app, but handle missing elements gracefully
                this.initApp();
            }, 100);
        } catch (error) {
            console.error('Error in Three.js constructor:', error);
        }
    }

    initApp() {
        const preloadAssets = new Promise((resolve) => {
            const startTime = performance.now();
            let loadedAssets = 0;
            const totalAssets = this.images.length + this.videos.length || 1;

            if (totalAssets === 1) {
                console.log('No assets to load, resolving immediately');
                resolve(0);
                return;
            }

            const updateProgress = () => {
                loadedAssets++;
                console.log(`Loaded asset ${loadedAssets}/${totalAssets}`);
                if (loadedAssets >= totalAssets) {
                    const endTime = performance.now();
                    const loadDuration = (endTime - startTime) / 1000;
                    console.log(`All assets loaded in ${loadDuration} seconds`);
                    resolve(loadDuration);
                }
            };

            const imagesPromise = new Promise<void>((res) => {
                if (this.images.length === 0) {
                    console.log('No images to load');
                    res();
                    return;
                }
                imagesLoaded(
                    document.querySelectorAll('img[data-webgl-media]'),
                    { background: true },
                    () => {
                        console.log('All images loaded');
                        this.images.forEach(() => updateProgress());
                        res();
                    }
                );
            });

            const videosPromise = new Promise<void>((res) => {
                if (this.videos.length === 0) {
                    console.log('No videos to load');
                    res();
                    return;
                }
                let loadedVideos = 0;
                this.videos.forEach((video) => {
                    video.load();
                    video.onloadeddata = () => {
                        loadedVideos++;
                        console.log(`Video loaded: ${video.src}`);
                        updateProgress();
                        if (loadedVideos === this.videos.length) {
                            console.log('All videos loaded');
                            res();
                        }
                    };
                    video.onerror = () => {
                        console.error(`Failed to load video: ${video.src}`);
                        loadedVideos++;
                        updateProgress();
                        if (loadedVideos === this.videos.length) {
                            res();
                        }
                    };
                });
            });

            Promise.all([imagesPromise, videosPromise]).then(() => {
                const endTime = performance.now();
                const loadDuration = (endTime - startTime) / 1000;
                resolve(loadDuration);
            });
        });

        preloadAssets.then((loadDuration: unknown) => {
            // Ensure minimum duration for visibility
            const minDuration = 2;
            const finalDuration = Math.max(loadDuration as number, minDuration);

            // Make sure overflow is hidden during animation
            document.documentElement.style.overflow = 'auto';

            // Handle missing DOM elements gracefully
            if (this.workElement && this.projectsElement && this.infoH1s.length >= 2) {
                console.log('All DOM elements found, starting animation timeline');
                // Only run animation timeline if all elements are present
                gsap.timeline({
                    onComplete: () => {
                        // Animate first h1
                        gsap.set(this.infoH1s[0], { opacity: 1 });
                        gsap.from(this.infoH1s[0].querySelectorAll('.element'), {
                            y: this.infoH1s[0].offsetHeight,
                            duration: 0.8,
                            stagger: 0.02,
                            ease: "expoScale(0.5,7,none)",
                        });

                        // Re-enable scroll, show WebGL, and fix .projects positioning
                        document.documentElement.style.overflow = 'auto';
                        window.scrollTo(0, 0);
                        if (this.projectsElement) {
                            this.projectsElement.style.position = 'relative';
                            this.projectsElement.style.top = '0'; // Ensure it's at the top
                        }
                        this.scene.visible = true;
                        // Ensure pointer events are enabled for the renderer
                        if (this.renderer && this.renderer.domElement) {
                            (this.renderer.domElement as HTMLElement).style.pointerEvents = 'auto';
                        }
                        gsap.to(this.renderer.domElement, {
                            opacity: 1,
                            duration: 0.5,
                            ease: "power2.in",
                        });
                        this.startApp();
                    }
                })
                .from(this.workElement, {
                    fontSize: '200vw',
                    duration: finalDuration,
                    ease: "power2.out",
                }, 0)
                .to(this.projectsElement, {
                    top: 0,
                    duration: 1,
                    ease: "power2.inOut",
                }, finalDuration - 0.6);
            } else {
                // If elements are missing, just start the app directly
                console.warn('Some DOM elements missing, starting app directly');
                document.documentElement.style.overflow = 'auto';
                window.scrollTo(0, 0);
                if (this.projectsElement) {
                    this.projectsElement.style.position = 'relative';
                    this.projectsElement.style.top = '0'; // Ensure it's at the top
                }
                this.scene.visible = true;
                // Ensure pointer events are enabled for the renderer
                if (this.renderer && this.renderer.domElement) {
                    (this.renderer.domElement as HTMLElement).style.pointerEvents = 'auto';
                    (this.renderer.domElement as HTMLElement).style.opacity = '1';
                }
                this.startApp();
            }
        });
    }

    breakTheTextGsap(domElem: HTMLElement) {
        let domElemVar = domElem.textContent || "";
        let domElemHeight = domElem.offsetHeight;
        let splittedText = domElemVar.split("");
        let clutter = "";
        splittedText.forEach(function(element, index) {
            clutter += `<span class="element">${element}</span>`;
        });
        domElem.innerHTML = clutter;
    }

    startApp() {
        try {
            console.log('Starting Three.js app');
            
            // Initialize Lenis with proper configuration according to project specs
            const lenis = new Lenis({
                duration: 1.6,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: true,
                syncTouch: true,
                infinite: false,
                direction: 'vertical',
                gestureDirection: 'vertical',
                lerp: 0.1,
            });
            
            this.scroll = lenis;

            // Sync ScrollTrigger with Lenis
            lenis.on('scroll', ScrollTrigger.update);
            
            // Tell ScrollTrigger to use Lenis as the scroller
            ScrollTrigger.scrollerProxy(document.documentElement, {
                scrollTop: (value?: number) => {
                    if (arguments.length && value !== undefined) {
                        lenis.scrollTo(value as number);
                        return value as number;
                    }
                    return lenis.scroll;
                },
                getBoundingClientRect() {
                    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
                },
                pinType: document.documentElement.style.transform ? "transform" : "fixed"
            });

            // Ensure we can scroll the page
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
            
            // Scroll to top immediately
            if (this.scroll) {
                this.scroll.scrollTo(0, { immediate: true });
            }

            this.addImages();
            this.setPosition();
            this.mouseMovement();
            this.addClickEvents();
            this.resize();
            this.setupResize();
            
            // Start the unified render loop
            this.render();
            
            // Add scroll event listener to update currentScroll
            if (this.scroll) {
                this.scroll.on('scroll', (e: any) => {
                    this.currentScroll = e.scroll;
                });
            }
            
            // Ensure pointer events are enabled for the renderer
            if (this.renderer && this.renderer.domElement) {
                (this.renderer.domElement as HTMLElement).style.pointerEvents = 'auto';
            }
            
            // Clean up function
            const cleanup = () => {
                if (this.scroll) {
                    this.scroll.destroy();
                }
                ScrollTrigger.getAll().forEach(st => st.kill());
            };
            
            // Store cleanup function for later use
            (window as any).galleryCleanup = cleanup;
            
        } catch (error) {
            console.error('Error starting Three.js app:', error);
            // Fallback: enable normal scrolling if Lenis fails
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
        }
    }

    mouseMovement() {
        // Add a small delay to ensure the DOM is ready
        setTimeout(() => {
            window.addEventListener('mousemove', (event) => {
                this.mouse.x = (event.clientX / this.width) * 2 - 1;
                this.mouse.y = -(event.clientY / this.height) * 2 + 1;

                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children);

                const isMobile = window.innerWidth <= 768;

                if (intersects.length > 0) {
                    let obj = intersects[0].object as THREE.Mesh;
                    if (!obj.userData.isFullScreen) {
                        (obj.material as THREE.ShaderMaterial).uniforms.uHover.value = intersects[0].uv;

                        if (this.currentHovered !== obj) {
                            if (this.currentHovered) {
                                const prevStoreItem = this.imageStore.find((s: any) => s.mesh === this.currentHovered);
                                gsap.to((this.currentHovered.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                                    duration: 0.3, // Reduced from 0.5 to 0.3 for sharper transition
                                    value: 0,
                                    ease: "power2.in",
                                });
                                if (prevStoreItem && !isMobile) {
                                    const projectContainer = prevStoreItem.img.closest('.project_container');
                                    const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                                    const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                                    if (listNum) {
                                        gsap.to(listNum, {
                                            y: 0,
                                            duration: 0.5,
                                            ease: "circ.inOut",
                                        });
                                    }
                                    if (listTitle) {
                                        gsap.to(listTitle, {
                                            y: 0,
                                            duration: 0.5,
                                            ease: "circ.inOut",
                                        });
                                    }
                                    
                                    // Show the HTML image when not hovering
                                    if (prevStoreItem.img) {
                                        prevStoreItem.img.style.opacity = '1';
                                    }
                                }
                                this.currentHovered.userData.hovered = false;
                            }

                            obj.userData.hovered = true;
                            const storeItem = this.imageStore.find((s: any) => s.mesh === obj);
                            gsap.to((obj.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                                duration: 0.3, // Reduced from 0.5 to 0.3 for sharper transition
                                value: 1,
                                ease: "power2.out", // Changed from "circ.inOut" to "power2.out" for sharper transition
                            });
                            if (storeItem && !isMobile) {
                                const projectContainer = storeItem.img.closest('.project_container');
                                const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                                const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                                const listNumHeight = listNum ? listNum.offsetHeight : 0;
                                const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
                                if (listNum) {
                                    gsap.to(listNum, {
                                        y: listNumHeight / 2,
                                        duration: 0.5,
                                        ease: "circ.inOut",
                                    });
                                }
                                if (listTitle) {
                                    gsap.to(listTitle, {
                                        y: -listTitleHeight / 2,
                                        duration: 0.5,
                                        ease: "circ.inOut",
                                    });
                                }
                                
                                // Hide the HTML image when hovering to show only the WebGL video
                                if (storeItem.img) {
                                    storeItem.img.style.opacity = '0';
                                }
                            }
                            this.currentHovered = obj;
                        }
                    }
                } else {
                    if (this.currentHovered) {
                        const prevStoreItem = this.imageStore.find((s: any) => s.mesh === this.currentHovered);
                        gsap.to((this.currentHovered.material as THREE.ShaderMaterial).uniforms.uHoverState, {
                            duration: 0.3, // Reduced from 0.5 to 0.3 for sharper transition
                            value: 0,
                            ease: "power2.in", // Changed from "circ.inOut" to "power2.in" for sharper transition
                        });

                        if (prevStoreItem && !isMobile) {
                            const projectContainer = prevStoreItem.img.closest('.project_container');
                            const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                            const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                            const listNumHeight = listNum ? listNum.offsetHeight : 0;
                            const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
                            if (listNum) {
                                gsap.to(listNum, {
                                    y: 0,
                                    duration: 0.5,
                                    ease: "circ.inOut",
                                });
                            }
                            if (listTitle) {
                                gsap.to(listTitle, {
                                    y: 0,
                                    duration: 0.5,
                                    ease: "circ.inOut",
                                });
                            }
                            
                            // Show the HTML image when not hovering
                            if (prevStoreItem.img) {
                                prevStoreItem.img.style.opacity = '1';
                            }
                        }
                        this.currentHovered.userData.hovered = false;
                        this.currentHovered = null;
                    }
                }
            });
        }, 100);
    }

    addClickEvents() {
        // Add a small delay to ensure the DOM is ready
        setTimeout(() => {
            // Add click event to the container
            this.container.addEventListener('click', (event) => {
                // Prevent default to avoid issues
                event.preventDefault();
                
                // Update mouse position based on click event
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
                
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children);
                const anyFullScreen = this.imageStore.some((i: any) => i.mesh.userData.isFullScreen);

                if (anyFullScreen) {
                    const fullScreenMesh = this.imageStore.find((i: any) => i.mesh.userData.isFullScreen);
                    if (fullScreenMesh) {
                        let tl = gsap.timeline();

                        // Animate mesh out of fullscreen
                        tl.to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uCorners.value, { x: 0, duration: 0.4 })
                          .to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uCorners.value, { z: 0, duration: 0.4 }, 0.1)
                          .to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uCorners.value, { y: 0, duration: 0.4 }, 0.2)
                          .to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uCorners.value, { w: 0, duration: 0.4 }, 0.3)
                          .to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uIsFullScreen, { value: 0, duration: 0 }, 0)
                          .to((fullScreenMesh.mesh.material as THREE.ShaderMaterial).uniforms.uProgress, { value: 0, duration: 0.7, ease: "linear" }, 0);

                        // Animate second h1 to bottom
                        tl.to(this.infoH1s[1].querySelectorAll('.element'), {
                            y: this.infoH1s[1].offsetHeight,
                            duration: 0.8,
                            stagger: 0.015,
                            ease: "expoScale(0.5,7,none)",
                        }, 0)
                        .to(this.infoH1s[1], {
                            opacity: 0,
                            duration: 0.8,
                        }, 0);

                        // Instantly set first h1 visible and move its elements above view
                        tl.set(this.infoH1s[0], { opacity: 1 }, 0)
                          .set(this.infoH1s[0].querySelectorAll('.element'), {
                              y: -this.infoH1s[0].offsetHeight
                          }, 0);

                        // Animate first h1 elements from top to center
                        tl.to(this.infoH1s[0].querySelectorAll('.element'), {
                            y: 0,
                            duration: 0.8,
                            stagger: 0.015,
                            ease: "expoScale(0.5,7,none)",
                        }, 0.2);

                        fullScreenMesh.mesh.userData.isFullScreen = false;
                        // Resume scrolling when exiting fullscreen
                        (this.renderer.domElement as HTMLElement).style.pointerEvents = 'auto';
                    }
                } else if (intersects.length > 0) {
                    let obj = intersects[0].object as THREE.Mesh;
                    if (!obj.userData.isFullScreen) {
                        let tl = gsap.timeline();
                        tl.to((obj.material as THREE.ShaderMaterial).uniforms.uCorners.value, { w: 1, duration: 0.4 })
                          .to((obj.material as THREE.ShaderMaterial).uniforms.uCorners.value, { y: 1, duration: 0.4 }, 0.1)
                          .to((obj.material as THREE.ShaderMaterial).uniforms.uCorners.value, { z: 1, duration: 0.4 }, 0.2)
                          .to((obj.material as THREE.ShaderMaterial).uniforms.uCorners.value, { x: 1, duration: 0.4 }, 0.3)
                          .to((obj.material as THREE.ShaderMaterial).uniforms.uIsFullScreen, { value: 1, duration: 0 }, 0)
                          .to((obj.material as THREE.ShaderMaterial).uniforms.uProgress, { value: 1, duration: 0.7, ease: "linear" }, 0)
                          // Animate first h1 to top, second h1 from bottom to center
                          .to(this.infoH1s[0].querySelectorAll('.element'), {
                              y: -this.infoH1s[0].offsetHeight,
                              duration: 0.8,
                              stagger: 0.015,
                              ease: "expoScale(0.5,7,none)",
                          }, 0)
                          .to(this.infoH1s[0], {
                              opacity: 0,
                              duration: 0.8,
                          }, 0)
                          .set(this.infoH1s[1], { opacity: 1 }, 0)
                          .set(this.infoH1s[1].querySelectorAll('.element'), {
                              y: this.infoH1s[1].offsetHeight
                          }, 0)
                          .to(this.infoH1s[1].querySelectorAll('.element'), {
                              y: 0,
                              duration: 0.8,
                              stagger: 0.015,
                              ease: "expoScale(0.5,7,none)",
                          }, 0.2);
                        obj.userData.isFullScreen = true;
                        // Stop scrolling when entering fullscreen
                        (this.renderer.domElement as HTMLElement).style.pointerEvents = 'auto';
                    }
                }
            });
        }, 100);
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
        this.setPosition();
        this.materialArr.forEach(material => {
            material.uniforms.uResolution.value.set(this.width, this.height);
        });
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

        this.imageStore = this.images.map((img, index) => {
            let imgBounds = img.getBoundingClientRect();

            const video = this.videos[index];
            if (!video) {
                console.error(`No video found for image index ${index}`);
                return null;
            }

            // Play video and handle errors
            const playVideo = () => {
                video.muted = true; // Ensure video is muted for autoplay
                video.loop = true; // Ensure video loops
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log(`Video playing successfully: ${video.src}`);
                        })
                        .catch(error => {
                            console.error(`Video playback failed for ${video.src}:`, error);
                            // Try to play again when user interacts
                            const playVideoOnInteraction = () => {
                                video.play().catch(e => console.error('Video play failed again:', e));
                                window.removeEventListener('click', playVideoOnInteraction);
                                window.removeEventListener('touchstart', playVideoOnInteraction);
                            };
                            window.addEventListener('click', playVideoOnInteraction);
                            window.addEventListener('touchstart', playVideoOnInteraction);
                        });
                }
            };

            // Play the video
            playVideo();

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            // Updated for Three.js compatibility - sRGBEncoding is deprecated
            videoTexture.colorSpace = THREE.SRGBColorSpace;

            // Create image texture and ensure it's properly loaded
            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            // Updated for Three.js compatibility - sRGBEncoding is deprecated
            texture.colorSpace = THREE.SRGBColorSpace;

            // Add an event listener to update the texture when the image loads
            img.addEventListener('load', () => {
                texture.needsUpdate = true;
            });

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

            return {
                img: img,
                mesh: imgMesh,
                top: imgBounds.top,
                left: imgBounds.left,
                width: imgBounds.width,
                height: imgBounds.height,
            };
        }).filter(item => item !== null) as any[];
    }

    setPosition() {
        this.imageStore.forEach(img => {
            const bounds = img.img.getBoundingClientRect();
            img.top = bounds.top + window.scrollY;
            img.left = bounds.left;
            img.width = bounds.width;
            img.height = bounds.height;

            img.mesh.position.x = img.left - this.width / 2 + img.width / 2;
            img.mesh.position.y = this.currentScroll - img.top + this.height / 2 - img.height / 2;
            img.mesh.material.uniforms.uQuadSize.value.set(img.width, img.height);
        });
    }

    render() {
        this.time = this.clock.getElapsedTime();
        
        // Update scroll position with Lenis
        if (this.scroll) {
            this.currentScroll = this.scroll.scroll;
        } else {
            // Fallback: use window scroll if Lenis is not available
            this.currentScroll = window.scrollY;
        }
        
        this.setPosition();
        
        // Update time and textures
        this.materialArr.forEach(material => {
            // Update time uniform
            (material as THREE.ShaderMaterial).uniforms.uTime.value = this.time;
            
            // Ensure image texture is updated
            if (material.uniforms.uImage && material.uniforms.uImage.value) {
                if (material.uniforms.uImage.value instanceof THREE.Texture) {
                    material.uniforms.uImage.value.needsUpdate = true;
                }
            }
            
            // Ensure video texture is updated
            if (material.uniforms.uImage1 && material.uniforms.uImage1.value) {
                if (material.uniforms.uImage1.value instanceof THREE.VideoTexture) {
                    material.uniforms.uImage1.value.needsUpdate = true;
                }
            }
        });
        
        this.renderer.render(this.scene, this.camera);
        
        // Continue the render loop with Lenis
        if (this.scroll) {
            this.scroll.raf(this.time * 1000); // Convert to milliseconds
            ScrollTrigger.update();
        }
        
        // Continue the render loop
        requestAnimationFrame(this.render.bind(this));
    }
}