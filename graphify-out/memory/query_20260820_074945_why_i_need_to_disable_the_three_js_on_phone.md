---
type: "query"
date: "2026-08-20T07:49:45.937769+00:00"
question: "why i need to disable the three.js on phone ?"
contributor: "graphify"
source_nodes: ["BackgroundScene()", "useSceneProfile()", "Scene()", "three"]
---

# Q: why i need to disable the three.js on phone ?

## Answer

Expanded from original query via graph vocab: [performance, scene, three, device, motion, particle, background]. Disabling Three.js on phones is a recommendation, not a requirement. The repository records a mobile landing Lighthouse score of 59, 720 ms total blocking time, and 4.7 s LCP, attributed to roughly 880 KB of WebGL code plus a render loop. The current phone profile lowers the particle count from 1800 to 600, but still downloads and parses Three.js, creates a WebGL context, and renders continuously. Returning a null scene profile for small or coarse-pointer devices would prevent the lazy Scene import entirely while preserving the existing CSS gradient. A balanced alternative is to skip 3D by default on phones and offer an Enable 3D control, or defer it until after the page becomes interactive.

## Source Nodes

- BackgroundScene()
- useSceneProfile()
- Scene()
- three