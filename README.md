# Andros Accessible WebGIS

**Design of a web map with digital accessibility for visually impaired users**

A web cartographic application for **Andros Island, Greece**, developed and evaluated as part of a Master's thesis in **Geoinformatics** at the **National Technical University of Athens (NTUA)**. The project explores how accessibility-oriented design can improve an existing interactive web map, particularly for people with visual impairments and colour-vision deficiencies.

## Project overview

The application combines a **Leaflet** web interface with thematic maps served by **GeoServer** through the Open Geospatial Consortium's **Web Map Service (WMS)**. It presents island-wide mapping at **1:150,000**, detailed mapping of **Chora at 1:5,000**, and thematic land-use information. The project focuses on improving both cartographic readability and access to map information through alternative interaction and presentation methods.

## Main features

- Interactive map with zooming, panning, layer selection and feature-information popups via WMS `GetFeatureInfo`.
- Four basemap choices: OpenStreetMap, Light OpenStreetMap, Esri World Gray Canvas and Esri World Imagery.
- GeoServer thematic layer groups for island-wide mapping, detailed Chora mapping, land use and annotations.
- Information sidebar with collapsible sections, legends and textual alternatives to cartographic symbols and themes.
- MiniMap overview, coordinate display and graphical scale.
- Scale-dependent cartographic styling, differentiated symbols and labels, and colour schemes informed by ColorBrewer and colour-vision-deficiency simulations.

## Accessibility approach

Accessibility improvements were designed with reference to **WCAG 2.2** and the **POUR** principles (Perceivable, Operable, Understandable and Robust). Implemented measures include:

- Semantic HTML landmarks and descriptive accessible names.
- Skip navigation links and keyboard-operable interface controls.
- Visible keyboard focus indicators and responsive interface adjustments.
- ARIA properties and live announcements for selected dynamic interface changes.
- Textual descriptions and legends as alternatives to visually presented map information.
- Attention to contrast, symbol differentiation, target size and reduced-motion preferences.

**Accessibility status:** The thesis reports a **100/100 Lighthouse accessibility score**, zero detected violations in its final **axe DevTools** automated assessment, and manual keyboard and **NVDA** screen-reader testing. These results apply to the evaluated configuration and **do not establish full WCAG 2.2 Level AA conformance**. In particular, individual WMS-rendered geographic features are not systematically keyboard-focusable, and no usability testing with participants with disabilities was conducted.

## Technology stack

- **Frontend:** HTML, CSS, JavaScript, Leaflet 1.9.4, jQuery 3.7.1 and jQuery UI 1.13.3.
- **Geospatial services:** GeoServer, OGC WMS (`GetMap`, `GetFeatureInfo`) and Styled Layer Descriptor (SLD) styles.
- **Data and cartography:** vector and raster geospatial datasets, including sources described in the thesis such as OpenStreetMap, CORINE Land Cover 2018 and Landsat 9.
- **Map controls:** Leaflet plugins for MiniMap, coordinates, graphic scale and coordinate-system support.

## Repository structure

The main application files are:

```text
index.html       # Main page and interface structure
mystyle.css      # Styling and responsive layout
geo.js           # Leaflet map configuration and interaction
js/              # Supporting JavaScript resources
img/             # Application images and symbols
```

Additional folders and JavaScript/CSS files contain Leaflet plugins and supporting components.

## Running the application

1. Clone or download this repository.
2. Open the project folder in an editor such as Visual Studio Code.
3. Serve the folder using a local HTTP server (for example, the **Live Server** extension) and open `index.html`.
4. Ensure that the external basemap services and the configured GeoServer WMS endpoints are reachable.

**Important:** This repository contains the web application source code, but the GeoServer-hosted geospatial datasets, published layers, layer groups and server-side SLD configuration may not be included. Reproducing the complete maps requires access to, or independent configuration of, compatible GeoServer services. Availability of the university-hosted service is not guaranteed.

## Evaluation and limitations

The research combined automated testing with **Google Lighthouse, WAVE and axe DevTools**, manual keyboard and NVDA checks, and cartographic assessments of symbols and colour differentiation. The findings support the value of integrating accessibility into existing web maps while recognizing remaining limitations in feature-level nonvisual interaction, assistive-technology coverage and user testing.

## Academic context

**Master's thesis:** *Design of a web map with digital accessibility for visually impaired users*  
**Author:** Charikleia Papachristou  
**Programme:** MSc in Geoinformatics  
**Institution:** National Technical University of Athens (NTUA)  
**Supervisor:** Andriani Skopeliti, Assistant Professor, NTUA  
**Date:** October 2026

## Attribution and reuse

The application uses third-party libraries, basemaps and geospatial data. Their respective attribution notices and licence conditions remain applicable. No licence is granted for the repository's original code unless a separate licence is added.
