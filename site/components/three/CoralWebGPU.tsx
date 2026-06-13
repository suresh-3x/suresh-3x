"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three/webgpu";
import {
  pass,
  color,
  float,
  vec3,
  uniform,
  time,
  Fn,
  If,
  instancedArray,
  instanceIndex,
  hash,
  positionLocal,
  positionWorld,
  normalWorld,
  cameraPosition,
  screenUV,
  mx_noise_float,
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
 * WebGPU coral-reef hero with a GPU-compute particle current.
 *
 * On WebGPU: tens of thousands of particles are simulated entirely on the GPU
 * (curl-ish noise current + upward drift + cursor repulsion) via TSL compute
 * shaders. On the WebGL2 fallback (no compute), a lighter CPU particle field is
 * used instead. TSL node materials carry animated caustics; the post pipeline
 * is DOF bokeh + bloom + AgX tone mapping + vignette. Scroll-linked camera rise
 * + pointer parallax. Pauses offscreen / tab-hidden; skipped under reduced motion.
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

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#06181d");
      scene.fog = new THREE.Fog("#06181d", 5, 15);

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

      // Animated underwater caustics (works on both backends).
      const caustic = Fn(() => {
        const p = positionWorld
          .mul(vec3(0.6, 0.32, 0.6))
          .add(vec3(0, time.mul(0.16), 0));
        const a = mx_noise_float(p);
        const b = mx_noise_float(p.mul(1.9).add(vec3(13, 5, 7)));
        const c = a.add(b).mul(0.5).max(0).pow(2.2);
        return color(0x9fe8ef).mul(c).mul(0.6);
      })();

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
        const pts: THREE.Vector3[] = [];
        for (let s = 0; s <= 6; s++) {
          const t = s / 6;
          const sway = Math.sin(t * Math.PI * (1.2 + rng())) * (0.4 + rng() * 0.4);
          pts.push(
            new THREE.Vector3(
              Math.cos(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
              t * height - 0.6,
              Math.sin(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
            ),
          );
        }
        const geo = new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(pts),
          32,
          0.07,
          8,
          false,
        );
        const mat = new THREE.MeshStandardNodeMaterial();
        mat.colorNode = color(branchHexes[i % 3]);
        mat.roughnessNode = float(0.55);
        mat.metalnessNode = float(0.05);
        mat.emissiveNode = (rim(0xff6f61, 3.0, 0.55) as any).add(caustic);
        coral.add(new THREE.Mesh(geo, mat));
        tips.push(pts[pts.length - 1]);
      }

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

      const rockMat = new THREE.MeshStandardNodeMaterial({
        color: 0x1a5a67,
        roughness: 0.9,
        flatShading: true,
      });
      rockMat.emissiveNode = (caustic as any).mul(0.5);
      const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 1), rockMat);
      rock.position.y = -0.7;
      coral.add(rock);

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

      const isWebGPU =
        (renderer.backend as { isWebGPUBackend?: boolean })?.isWebGPUBackend ??
        !!(navigator as Navigator & { gpu?: unknown }).gpu;

      // ---- particle current ----
      const cursor = uniform(new THREE.Vector3(0, 0, 0));
      const dtU = uniform(0);

      // CPU fallback bits (WebGL2)
      let cpuGeo: THREE.BufferGeometry | null = null;
      let cpuCount = 0;
      // GPU compute bits (WebGPU)
      let posBuf: any = null;
      let computeUpdate: unknown = null;
      let computeCount = 0;

      if (isWebGPU) {
        computeCount = lowPower ? 8000 : 30000;
        posBuf = instancedArray(computeCount, "vec3");
        const velBuf = instancedArray(computeCount, "vec3");

        const computeInit = (
          Fn(() => {
            const pos = posBuf!.element(instanceIndex);
            const vel = velBuf.element(instanceIndex);
            pos.x.assign(hash(instanceIndex).sub(0.5).mul(14));
            pos.y.assign(hash(instanceIndex.add(1)).sub(0.5).mul(10));
            pos.z.assign(hash(instanceIndex.add(2)).sub(0.5).mul(9));
            vel.assign(vec3(0));
          })() as any
        ).compute(computeCount);

        computeUpdate = (
          Fn(() => {
            const pos = posBuf!.element(instanceIndex);
            const vel = velBuf.element(instanceIndex);
            const sp = pos.mul(0.16).add(vec3(0, time.mul(0.06), time.mul(0.02)));
            const nx = mx_noise_float(sp);
            const ny = mx_noise_float(sp.add(vec3(19.1, 7.3, 0)));
            const nz = mx_noise_float(sp.add(vec3(0, 11.7, 23.5)));
            const current = vec3(nx, ny.mul(0.6).add(0.4), nz).mul(0.4);
            const toC = pos.sub(cursor);
            const cd = toC.length().max(0.0001);
            const strength = float(2.4).sub(cd).max(0).mul(1.2);
            const push = toC.div(cd).mul(strength);
            vel.assign(vel.mul(0.9).add(current.mul(dtU)).add(push.mul(dtU)));
            pos.addAssign(vel);
            If(pos.y.greaterThan(5), () => pos.y.assign(-5));
            If(pos.y.lessThan(-5), () => pos.y.assign(5));
            If(pos.x.greaterThan(7), () => pos.x.assign(-7));
            If(pos.x.lessThan(-7), () => pos.x.assign(7));
            If(pos.z.greaterThan(5), () => pos.z.assign(-5));
            If(pos.z.lessThan(-5), () => pos.z.assign(5));
          })() as any
        ).compute(computeCount);

        renderer.compute(computeInit);

        const pGeo = new THREE.SphereGeometry(0.013, 6, 6);
        const pMat = new THREE.MeshStandardNodeMaterial();
        pMat.positionNode = positionLocal.add(posBuf.element(instanceIndex));
        pMat.colorNode = color(0x1a5a67);
        pMat.emissiveNode = Fn(() => {
          const flick = mx_noise_float(
            posBuf!.element(instanceIndex).mul(0.5).add(time),
          )
            .mul(0.35)
            .add(0.5);
          return color(0xabe2e6).mul(flick);
        })();
        pMat.roughnessNode = float(0.4);
        const particles = new THREE.InstancedMesh(pGeo, pMat, computeCount);
        particles.frustumCulled = false;
        scene.add(particles);
      } else {
        cpuCount = lowPower ? 150 : 340;
        const arr = new Float32Array(cpuCount * 3);
        for (let i = 0; i < cpuCount; i++) {
          arr[i * 3] = (Math.random() - 0.5) * 10;
          arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        cpuGeo = new THREE.BufferGeometry();
        cpuGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        const pMat = new THREE.PointsNodeMaterial();
        pMat.color = new THREE.Color(0xabe2e6);
        pMat.size = 0.04;
        pMat.sizeAttenuation = true;
        pMat.transparent = true;
        pMat.opacity = 0.7;
        pMat.depthWrite = false;
        pMat.blending = THREE.AdditiveBlending;
        scene.add(new THREE.Points(cpuGeo, pMat));
      }

      // ---- post-processing ----
      const post = new THREE.RenderPipeline(renderer);
      const scenePass = pass(scene, camera);
      const sceneColor = scenePass.getTextureNode("output");
      const viewZ = scenePass.getViewZNode();
      const focus = uniform(4.6);
      const bloomPass = bloom(sceneColor, 0.6, 0.4, 0.5);
      let outputNode: any;
      if (lowPower) {
        outputNode = (sceneColor as any).add(bloomPass);
      } else {
        const dofPass = dof(sceneColor, viewZ, focus, 3.2, 0.7);
        outputNode = (dofPass as any).add(bloomPass);
      }
      const vignette = Fn(() => {
        const d = screenUV.sub(0.5).length();
        return float(1).sub(d.mul(0.55).pow(2.2)).saturate();
      })();
      post.outputNode = outputNode.mul(vignette);

      // ---- interaction ----
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

        if (isWebGPU && computeUpdate) {
          dtU.value = Math.min(dt, 0.033);
          cursor.value.set(pointer.x * 6, pointer.y * 3.5, 0);
          renderer.compute(computeUpdate as never);
        } else if (cpuGeo) {
          const a = cpuGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < cpuCount; i++) {
            a[i * 3 + 1] += dt * 0.18;
            if (a[i * 3 + 1] > 4) a[i * 3 + 1] = -4;
          }
          cpuGeo.attributes.position.needsUpdate = true;
        }

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
