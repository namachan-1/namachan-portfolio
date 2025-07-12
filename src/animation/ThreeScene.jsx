// src/components/ThreeScene.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Import GLTFLoader
import { Box } from "@chakra-ui/react"; // Using Chakra UI Box for styling the container

const ThreeScene = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null); // Ref to store the AnimationMixer
  const clockRef = useRef(new THREE.Clock()); // Ref to store the Clock for animations

  useEffect(() => {
    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
    renderer.setClearColor(0x000000, 0); // Make renderer background transparent

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mountRef.current.appendChild(renderer.domElement);

    // Set a background color for the scene (optional, if alpha is false)
    // scene.background = new THREE.Color(0xf0f0f0); // Light grey background

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Softer ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7).normalize();
    directionalLight.castShadow = true; // Enable shadows for the light
    scene.add(directionalLight);

    // Optional: Add a subtle ground plane for shadows
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2; // Rotate to be horizontal
    plane.position.y = -1.5; // Position below the character
    plane.receiveShadow = true; // Plane receives shadows
    scene.add(plane);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.8, 0); // Target slightly above the origin for a character
    camera.position.set(0, 1.5, 3); // Position camera to view the character
    controls.update();

    // 4. Load 3D Character Model
    const loader = new GLTFLoader();
    // IMPORTANT: Replace this with the URL to your .glb or .gltf model
    // Example: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb'
    // Or a simple animated cube for testing: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/gltf/AnimatedMorphSphere/AnimatedMorphSphere.glb'
    const modelPath =
      "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb";

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -1, 0); // Adjust position if needed (e.g., to sit on the plane)
        model.scale.set(1, 1, 1); // Adjust scale if the model is too big/small
        scene.add(model);

        // Enable shadows for all meshes in the model
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Handle animations
        if (gltf.animations && gltf.animations.length) {
          mixerRef.current = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixerRef.current.clipAction(clip);
            action.play();
          });
        }
      },
      (xhr) => {
        // Optional: Progress callback
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        // Error callback
        console.error("An error happened loading the model:", error);
      },
    );

    // 5. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta(); // Get time elapsed for animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta); // Update animations
      }

      controls.update();
      renderer.render(scene, camera);
    };

    // 6. Handle Window Resizing for Responsiveness
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Use ResizeObserver for robust resizing based on container
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
      // Call handleResize immediately after observing to set initial size correctly
      handleResize();
    }

    animate(); // Start the animation loop

    // Cleanup function: This runs when the component unmounts
    return () => {
      // No need for window.removeEventListener('resize', handleResize) if only using ResizeObserver
      if (mountRef.current) {
        resizeObserver.unobserve(mountRef.current); // Disconnect ResizeObserver
      }
      controls.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Dispose of Three.js resources to prevent memory leaks
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <Box
      ref={mountRef}
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      {/* The Three.js canvas will be appended here */}
    </Box>
  );
};

export default ThreeScene;
