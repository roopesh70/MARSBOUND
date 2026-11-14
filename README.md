# MARSBOUND: Jezero Field Expedition
### Mars 3D Exploration, Science & Survival Simulator

> **Platform:** Browser-based 3D Desktop Web Game  
> **Built with:** React 18, TypeScript, Three.js, Tailwind CSS, Vite  
> **NASA Science Foundation:** NASA Mars Trek (JPL), HiRISE, MOLA, CRISM, MEDA, Mars 2020 Perseverance  
> **NASA Space Apps Challenge:** [Interplanetary Survival Guide: Martian Map](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=resources)

---

## 🚀 How to Run the Project (Quick Start for Beginners)

You can launch the simulator in two simple steps:

### 1. Start the Local Development Server
Open your terminal inside this folder (`d:\D_PROJECTS\MARSBOUND`) and run:
```bash
npm run dev
```

### 2. Open the Game in Your Browser
Open your browser (Chrome, Edge, Firefox, or Brave) and navigate to:
```
http://localhost:3000
```
Click **"COMMENCE EXPEDITION"** on the introductory screen, then click anywhere on the 3D surface to lock your mouse and begin walking on Mars!

---

## 🎮 Controls Quick-Reference

| Input | Action |
|---|---|
| **W, A, S, D** / Arrows | Move forward, backward, left, right (or steer/drive when inside Rover) |
| **Mouse** | Look around (Click the viewport to lock; automatically re-locks upon closing any panel) |
| **Space** | Mars low-gravity hop ($3.71\text{ m/s}^2$) / Handbrake when in Rover |
| **Shift** | Sprint / Fast traverse across the crater floor |
| **L** / **T** | **Toggle Helmet Flashlight / Rover Headlights** (dual high-intensity beams for nighttime exploration) |
| **E** | **Board / Dismount Mars Rover** (approach the rover parked outside base) |
| **B** | **Toggle Base Build Mode** (press **B** to enter, press **B** again or **Esc** to exit) |
| **X** | **Toggle Construct vs. Dismantle Mode** in Build Mode (or click the Dismantle card) |
| **Left Click** | Place building in Construct mode / Click targeted structure to Dismantle & recycle |
| **F** | **Discovery Scanner & Modal Toggle** (press **F** to scan outcrops; press **F** again to dismiss the discovery dossier!) |
| **R** | **NASA Provenance Registry Toggle** (press **R** to open, press **R** again to close; rotates structure in Build Mode) |
| **M** | **Tactical GIS Map Toggle** (press **M** to open full-screen GIS map, press **M** again to close) |
| **O** | **Mission Briefings Toggle** (press **O** to open objectives panel, press **O** again to close) |
| **J** | **Research Journal Toggle** (press **J** to open sample logs, press **J** again to close) |
| **Esc / C / X** | **Universal Close Keys** (instantly dismisses whichever modal/scan/dossier is open and restores mouse look) |

---

## 🪐 Major Features & Systems

### 1. Realistic NASA Exploration Mars Rover (`src/game/rover/MarsRover.ts`)
* **Stationed at Octavia Base:** Walk near the rover and press **[E]** to board or dismount.
* **Authentic NASA 3D Architecture:**
  - **Rocker-Bogie Suspension Rigging:** Structural titanium rocker tubes and bogie pivot links connecting all 6 wheels to the central differential.
  - **Machined Aluminum Wheels:** Chevron grousers (cleats), spiral flexure spokes, and planetary gear hub caps.
  - **Remote Sensing Mast (RSM):** Elevated carbon-fiber mast featuring dual Mastcam-Z stereo zoom lenses, SuperCam laser spectrometer aperture, and MEDA wind sensor booms.
  - **Articulated Robotic Arm:** Front-right multi-joint arm equipped with a rock coring drill bit and science turret.
  - **Rear MMRTG & HGA Dish:** Nuclear radioisotope thermoelectric generator with 8 radial radiative cooling fins, High-Gain parabolic antenna dish, and UHF orbital relay.
  - **Gold Foil & MLI Thermal Blankets:** Gold Kapton foil and silver beta-cloth wrapping across underbody and avionics bays.
* **6-Wheel Terrain Conformity & Real-Time Suspension:**
  - Independent terrain elevation sampling under all 6 wheel ground patches.
  - Computes both **Pitch** and **Roll** so the rover chassis rocks and tilts over uneven terrain, craters, and ridges.
  - Individual vertical wheel travel ($y = -0.65\text{m} \dots -0.15\text{m}$) allows wheels to climb over rocks while the rocker-bogie absorbs shocks.
* **4-Corner Ackermann Steering:**
  - Front wheels turn into curves while rear wheels counter-steer (at $-0.75\times$) for authentic tight zero-radius planetary maneuvers.
* **Persistent Regolith Tire Tracks:**
  - Automatically imprints dual chevron tread marks into the Martian regolith trailing behind the rover.
* **Dynamic Spring-Arm Chase Camera (`src/game/MarsCanvas.tsx`):**
  - Smooth spring-damper trailing camera with inertial lag when cornering.
  - Subtle terrain micro-rumble vibration at high speeds.
  - Dynamic FOV expansion ($70^\circ \to 78^\circ$) scaling with speed for a visceral sense of velocity.
* **Dual-Tone Planetary Gear Audio (`src/services/audioService.ts`):**
  - Low-end electric hub motor rumble paired with high-pitch planetary gear reduction whine.
* **Cabin Life-Support:**
  - Refills your suit oxygen reserves while driving across long distances.

### 2. Outpost Base Construction (`src/game/outpost/BuildModeSystem.ts`)
* Press **[B]** to enter Build Mode with an interactive holographic placement grid.
* Move around within the base perimeter (55m radius); the preview glows green on valid ground and red when too far or too steep.
* Press **[R]** to rotate the structure by 45°.
* Left-click to construct:
  - **Solar Array:** $+2,400\text{ W}$ generation.
  - **Cryo-Battery Bank:** $+20,000\text{ Wh}$ energy buffer.
  - **Surface Science Lab:** $-800\text{ W}$ demand, expands sample analytics.
  - **High-Gain Comms Dish:** $-350\text{ W}$ demand, orbital uplink.
  - **Secondary Habitat Pod:** Inflatable pressurized shelter.
* Live Outpost Power Grid telemetry displays real-time generation, consumption, and battery storage.
* **EVA Modular Decommissioning & Dismantle Mode (`[X]`):**
  - Press **[X]** while in Build Mode (or click the **Dismantle** card) to switch from Construct to Dismantle mode.
  - Aim at any placed base structure within 16 meters: an amber holographic targeting wireframe locks onto it with prompt `[CLICK TO DISMANTLE: (NAME)]`.
  - Left-clicking dismantles the structure, disposes its 3D model, plays a decommissioning audio cue, rebalances the power grid, and saves the changes.
  - **Core Safety Logic:** The primary `Octavia Base Habitat Core Mk I` is locked with life-support protection and cannot be dismantled.

### 3. Active Roaming Martian Dust Devils (`src/game/environment/DustDevils.ts`)
* 3 autonomous dust devil vortices traverse the Jezero Crater floor.
* Towering columns of swirling, glowing red sand particles.
* Walking or driving into a dust devil triggers authentic howling wind audio and dense dust scattering.

### 4. Multi-Mission Research Campaign & Live Telemetry Tracking (`src/data/missions.ts`)
* **Mission 01:** *Investigate a Martian Geological Outcrop* (Hike to Delta Scarp, scan ancient clay mudstone, record Sample #MB-01, return to base).
* **Mission 02:** *Kodiak Butte Long-Distance Rover Expedition* (Board rover, drive south to Kodiak Butte, survey dipping Gilbert delta strata).
* **Mission 03:** *Expand Outpost Infrastructure & Power Grid* (Enter build mode with [B] and deploy auxiliary power to exceed $4,800\text{ W}$).
* **Live HUD Objective Tracker:** Displays current active mission step and real-time distance and cardinal direction to the target waypoint (e.g. `TARGET: 42m [NW]`).
* **Visual Mission Completion Toast:** Pops up on-screen banner with audio chime when any objective is fulfilled.

### 5. Next-Level Tactical GIS Map & Live Radar HUD
* **Real-Time Circular Radar Mini-Map (`src/components/ui/MiniMap.tsx`):**
  - Integrated directly into your exploration HUD under the compass.
  - Features dynamic 360° radar sweep animation, concentric distance range rings (80m, 160m, 320m), base perimeter indicator, and live blips for all 15 discovery sites.
  - Displays rover position, active mission objective waypoint, and custom navigation pins with distance vectors.
  - Can be zoomed, minimized, or expanded to full screen anytime.
* **Interactive Pan & Smooth Zoom Engine (`src/components/panels/TacticalMapModal.tsx`):**
  - Smooth hardware-accelerated SVG zooming from $1.0\times$ to $4.0\times$ via mouse wheel or zoom buttons.
  - Click and drag to pan anywhere across the $500\text{ m} \times 500\text{ m}$ Jezero Crater delta quadrant.
  - Instant **"Recenter on Player"** and **"Reset Zoom"** controls.
* **Custom Navigation Waypoint Pinning (`SET PIN`):**
  - Click anywhere on the map to plant an interactive navigation beacon.
  - Calculates real-time Areoid coordinates ($18.xxxx^\circ\text{N}, 77.xxxx^\circ\text{E}$), ground distance, and draws a glowing magenta vector line.
  - Live HUD pin tracker guides your steps in real-time.
* **Traverse Measurement Ruler (`MEASURE`):**
  - Click two points on Mars to measure straight-line distance, estimated EVA walking time, suit oxygen cost, and Rover transit time.
* **5 Scientific GIS Heatmap Layers:**
  - **HiRISE Surface Ortho:** True-color visible light satellite imagery with crater morphology and dune ripples.
  - **MOLA Elevation Heatmap:** Color-graded topographic relief with contour isobars from $-2,580\text{ m}$ to $-2,400\text{ m}$.
  - **CRISM Hyperspectral Mineralogy:** Phyllosilicate clays (smectites), carbonates, olivine cumulates, and hydrated sulfates.
  - **THEMIS Thermal Inertia:** Surface trafficability, rock abundance, and loose drift sand hazards.
  - **Slope Hazard Safety:** Slope risk gradient (Green $<5^\circ$, Yellow $5^\circ-15^\circ$, Red $>15^\circ$ steep cliffs).
* **Live GPS Breadcrumb Trail & Outpost Base Overlay:**
  - Automatically records and plots the astronaut's and rover's historical path since landing.
  - Renders all constructed Outpost structures (Solar Arrays, Batteries, Labs, Dishes, Habitats) at their exact coordinates.
* **Interactive POI Inspector Drawer:**
  - Clicking any discovery opens a quick-inspection drawer with geological summary, distance, elevation, and one-click **"NAVIGATE HERE"** to set as active waypoint.

### 6. Expanded NASA Scientific Discoveries (15 Authentic Sites)
1. **Octavia E. Butler Landing Site** (Sol 0, Perseverance & Ingenuity touchdown)
2. **Wright Brothers Field** (Sol 59, Ingenuity first atmospheric flight on another planet)
3. **Delta Scarp — Hawkes Bay Outcrop** (Sol 414, ancient smectite clays preserving biosignatures)
4. **Hogwallow Flats** (Sol 498, organic-bearing mudstones with sulfate veins)
5. **Three Forks Sample Depot** (Sol 682, humanity's first sample repository on Mars)
6. **Kodiak Butte** (Sol 55, Gilbert delta strata proving Jezero held an open paleolake)
7. **Séítah Dune Field & Olivine Cumulate** (Sol 260, ancient ultramafic igneous basement)
8. **Skrinkle Haven** (Sol 721, violent torrential river flood conglomerates)
9. **Belva Impact Crater** (Sol 800, 1km crater excavating deep delta stratigraphy)
10. **Neretva Vallis River Gorge** (Sol 1175, colossal river inflow breach)
11. **Cheyava Falls** (Sol 1215, July 2024 "leopard spots" potential biosignature candidate)
12. **Castell Henllys** (Sol 1061, Jezero crater margin carbonate "bathtub ring")
13. **Mount Washburn & Atoko Point** (Sol 1162, exotic white anorthosite crust boulder)
14. **Berea Outcrop** (Sol 749, delta-top siltstone with magnesium carbonate & silica)
15. **Yori Pass** (Sol 623, cross-bedded sandstone slabs at river mouth)

### 7. Photorealistic 3D World Realism & Iconic NASA Landmarks
* **Procedural PBR Terrain Textures (`src/game/terrain/JezeroTerrain.ts`):** High-frequency normal and roughness maps capturing eolian sand ripples (15° prevailing wind tilt), pebble gravel, and cracked regolith crust with ACES Filmic tone mapping.
* **360° Distant Crater Rim Mountain Wall:** Enclosing geological rim mountains ($r = 310\text{m} - 850\text{m}$, peaks up to $110\text{m}$) featuring atmospheric distance haze and the historic **Neretva Vallis Gorge** river breach.
* **Authentic Martian Blue Sunsets (`src/game/environment/MarsAtmosphere.ts`):** Forward Mie scattering by iron oxide atmospheric dust causes the sun halo to turn from warm cream to vibrant cyan-blue (`#38bdf8`) as it nears the horizon, matching real NASA Curiosity and Perseverance sunset photos.
* **Deep Space Night Sky with Earth as the Evening Star:** Over 2,800 stars with spectral color temperatures, Milky Way galactic plane band, and Earth shining brightly as the Evening Star with its companion Moon.
* **Procedural 3D NASA Landmarks (`src/game/environment/NasaLandmarks.ts`):**
  - **Ingenuity Mars Helicopter:** Solar panel, avionics box, 4 carbon fiber landing legs, and animated coaxial counter-rotating blades.
  - **Three Forks Sample Depot:** 10 dropped titanium sample tubes scattered across the delta apron.
  - **Cheyava Falls Outcrop:** Layered mudstone with white calcium sulfate veins, dark iron-phosphate leopard spots, and a core drill hole.
  - **Atoko Point Boulder:** Anorthosite crystalline white boulder on Mount Washburn.
  - **Sky Crane Blast Ring:** Scorched touchdown zone at Octavia E. Butler Landing.
* **Regolith Dust Dynamics & EVA Helmet Visor:**
  - Low-gravity boot regolith dust puffs on footsteps and radial impact bursts upon low-gravity jump landings.
  - Rover wheel dust plumes kicked up behind all 6 wheels when accelerating across the terrain.
  - Astronaut EMU helmet visor glass reflection and gold UV protection film brow glare overlay.
* **Clean Collision-Free Tactical GIS Map:**
  - Removed messy overlapping labels across base modules and discoveries.
  - Smart hover-only badges: hovering over any pin or base module displays its sleek, high-contrast name pill without colliding with neighbors.
  - Enlarged hitboxes ($r = 4.5 - 5.5$) make locating, inspecting, and clicking effortless.

---

## 📚 NASA Data & Challenge References
- **NASA Space Apps Challenge:** [Interplanetary Survival Guide: Martian Map](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/?tab=resources)
- **NASA Mars Trek (JPL):** [https://trek.nasa.gov/mars/](https://trek.nasa.gov/mars/)
- **HiRISE (University of Arizona):** [https://www.uahirise.org/](https://www.uahirise.org/)
- **NASA Planetary Data System (PDS):** [https://pds-geosciences.wustl.edu/](https://pds-geosciences.wustl.edu/)
- **Perseverance Mars 2020 Mission:** [https://mars.nasa.gov/mars2020/](https://mars.nasa.gov/mars2020/)
