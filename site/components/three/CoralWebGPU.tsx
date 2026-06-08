"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import {
  pass,
  color,
  float,
  uniform,
  Fn,
  positionWorld,
  normalWorld,
  cameraPosition,
  screenUV,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { dof } from "three/addons/tsl/display/DepthOfFieldNode.js";

/** Deterministic PRNG so the coral formation is stable across reloads. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * WebGPU coral-reef hero. Vanilla three.js (WebGPURenderer auto-falls back to
 * WebGL2 where WebGPU is unavailable), TSL node materials with a fresnel rim,
 * and a TSL post pipeline: depth-of-field bokeh + bloom + AgX tone mapping +
 * vignette. Scroll-linked camera rise + pointer parallax. Pauses offscreen /
 * tab-hidden; not mounted under prefers-reduced-motion (the poster shows).
 */
export function CoralWebGPU({ lowPower = false }: { lowPower?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let renderer: THREE.WebGPURenderer | null = null;
    let raf: { stop: () => void } | null = null;
    const offFns: Array<() => void> = [];
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const run = async () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      // ---- scene ----
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#06181d");
      scene.fog = new THREE.Fog("#06181d", 5, 14);

      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
      camera.position.set(0, 0.2, 4.6);

      scene.add(new THREE.AmbientLight(0x73ccd3, 1.1));
      const key = new THREE.DirectionalLight(0xffd9c9, 2.4);
      key.position.set(4, 6, 5);
      scene.add(key);
      const fill = new THREE.PointLight(0x1f8c99, 7, 0, 1.5);
      fill.position.set(-4, -2, -3);
      scene.add(fill);
      const accent = new THREE.PointLight(0xff6f61, 4, 0, 1.5);
      accent.position.set(0, 3, 2);
      scene.add(accent);

      // ---- procedural coral ----
      const coral = new THREE.Group();
      coral.position.y = -0.2;
      scene.add(coral);

      const rim = (hex: number, power: number, strength: number) =>
        Fn(() => {
          const viewDir = cameraPosition.sub(positionWorld).normalize();
          const fres = float(1)
            .sub(normalWorld.dot(viewDir).saturate())
            .pow(power);
          return color(hex).mul(fres).mul(strength);
        })();

      const rng = mulberry32(1337);
      const branchHexes = [0xff6f61, 0xff9b86, 0xf24d3d];
      const tips: THREE.Vector3[] = [];

      for (let i = 0; i < 11; i++) {
        const angle = (i / 11) * Math.PI * 2 + rng() * 0.4;
        const radius = 0.15 + rng() * 0.25;
        const height = 1.6 + rng() * 1.4;
        const points: THREE.Vector3[] = [];
        for (let s = 0; s <= 6; s++) {
          const t = s / 6;
          const sway = Math.sin(t * Math.PI * (1.2 + rng())) * (0.4 + rng() * 0.4);
          points.push(
            new THREE.Vector3(
              Math.cos(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
              t * height - 0.6,
              Math.sin(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
            ),
          );
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 32, 0.07, 8, false);
        const mat = new THREE.MeshStandardNodeMaterial();
        mat.colorNode = color(branchHexes[i % 3]);
        mat.roughnessNode = float(0.55);
        mat.metalnessNode = float(0.05);
        mat.emissiveNode = rim(0xff6f61, 3.0, 0.55);
        coral.add(new THREE.Mesh(geo, mat));
        tips.push(points[points.length - 1]);
      }

      // glowing polyp tips (bloom)
      const tipGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const tipMat = new THREE.MeshStandardNodeMaterial();
      tipMat.colorNode = color(0xffe0d9);
      tipMat.emissiveNode = color(0xff6f61).mul(1.6);
      tipMat.roughnessNode = float(0.3);
      for (const tip of tips) {
        const m = new THREE.Mesh(tipGeo, tipMat);
        m.position.copy(tip);
        coral.add(m);
      }

      // base rock
      const rock = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.7, 1),
        new THREE.MeshStandardNodeMaterial({
          color: 0x1a5a67,
          roughness: 0.9,
          flatShading: true,
        }),
      );
      rock.position.y = -0.7;
      coral.add(rock);

      // ---- drifting particle field ----
      const count = lowPower ? 150 : 340;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsNodeMaterial();
      pMat.color = new THREE.Color(0xabe2e6);
      pMat.size = 0.035;
      pMat.sizeAttenuation = true;
      pMat.transparent = true;
      pMat.opacity = 0.7;
      pMat.depthWrite = false;
      pMat.blending = THREE.AdditiveBlending;
      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);

      // ---- renderer ----
      renderer = new THREE.WebGPURenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.5));
      renderer.toneMapping = THREE.AgXToneMapping;
      renderer.toneMappingExposure = 1.05;
      const el = renderer.domElement;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "block";
      container.appendChild(el);

      await renderer.init();
      if (disposed) return;

      // ---- post-processing (TSL) ----
      const post = new THREE.RenderPipeline(renderer);
      const scenePass = pass(scene, camera);
      const sceneColor = scenePass.getTextureNode("output");
      const viewZ = scenePass.getViewZNode();
      const focus = uniform(4.6);
      // Display-effect nodes (bloom/dof) have incomplete TS types for the
      // chainable node operators, though they're correct at runtime — cast here.
      const bloomPass = bloom(sceneColor, 0.6, 0.4, 0.5);

      let outputNode: any;
      if (lowPower) {
        outputNode = (sceneColor as any).add(bloomPass);
      } else {
        const dofPass = dof(sceneColor, viewZ, focus, 3.2, 1.3);
        outputNode = (dofPass as any).add(bloomPass);
      }
      const vignette = Fn(() => {
        const d = screenUV.sub(0.5).length();
        return float(1).sub(d.mul(0.55).pow(2.2)).saturate();
      })();
      post.outputNode = outputNode.mul(vignette);

      // ---- interaction state ----
      const pointer = { x: 0, y: 0 };
      const scroll = { v: 0 };
      const onScroll = () => {
        scroll.v = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      offFns.push(() => window.removeEventListener("scroll", onScroll));
      offFns.push(() => window.removeEventListener("pointermove", onPointer));

      // pause when offscreen / tab hidden
      let active = true;
      io = new IntersectionObserver(
        ([entry]) => (active = entry.isIntersecting && !document.hidden),
        { threshold: 0.02 },
      );
      io.observe(container);
      const onVis = () => {
        if (document.hidden) active = false;
      };
      document.addEventListener("visibilitychange", onVis);
      offFns.push(() => document.removeEventListener("visibilitychange", onVis));

      ro = new ResizeObserver(() => {
        if (!renderer) return;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      });
      ro.observe(container);

      // ---- render loop ----
      const timer = new THREE.Timer();
      const target = new THREE.Vector3();
      const orbit = lowPower ? 0 : 0.4;

      const loop = () => {
        if (!active || !renderer) return;
        timer.update();
        const dt = timer.getDelta();
        const t = timer.getElapsed();
        const s = scroll.v;

        target.set(
          Math.sin(t * 0.1) * orbit + pointer.x * 1.2,
          0.2 + pointer.y * 0.6 + s * 1.7,
          4.6 + s * 3.4,
        );
        camera.position.lerp(target, 1 - Math.pow(0.001, dt));
        camera.lookAt(0, 0.2 + s * 0.9, 0);
        focus.value = camera.position.length();

        coral.rotation.y += dt * 0.08;
        coral.position.y = -0.2 + Math.sin(t * 1.1) * 0.04;

        const arr = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
          arr[i * 3 + 1] += dt * 0.18;
          if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
        }
        pGeo.attributes.position.needsUpdate = true;
        points.rotation.y += dt * 0.02;

        post.render();
      };
      renderer.setAnimationLoop(loop);
      raf = { stop: () => renderer?.setAnimationLoop(null) };
    };

    run().catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[CoralWebGPU] init failed:", err);
      }
    });

    return () => {
      disposed = true;
      raf?.stop();
      offFns.forEach((fn) => fn());
      io?.disconnect();
      ro?.disconnect();
      if (renderer) {
        const el = renderer.domElement;
        renderer.dispose();
        el.parentNode?.removeChild(el);
      }
    };
  }, [lowPower]);

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
