# Chinese CCTV Exposure in India

Interactive map visualizing internet-facing Chinese-manufactured surveillance cameras detected across India's public IPv4 address space.

**Live:** [Github.io link](https://ella-bakshi.github.io/cctv-scanner-result/)

## Overview

On 1 April 2026, India's mandate requiring STQC certification for all CCTV cameras under the Compulsory Registration Order (CRO), 2021 came into full effect. This project documents the exposure surface of non-certified, Chinese-manufactured surveillance devices that remain directly accessible on the public internet as of the enforcement date.

### Key Findings

- **1,916** Chinese surveillance cameras detected across **30** States and Union Territories
- **71%** have open RTSP (live video streaming) ports
- Top affected cities: Bengaluru (204), Mumbai (169), Chennai (91), Hyderabad (82)

## Methodology

Full IPv4 scan of **70.5 million** Indian IP addresses across 27,746 CIDR blocks covering all major ISPs (Airtel, BSNL, Jio, and others). 35 camera-specific ports probed per host using multi-signal fingerprinting:

- HTTP server header analysis
- HTML title pattern matching
- Favicon hashing (MurmurHash3, Shodan-compatible)
- Proprietary protocol detection (Dahua port 37777, XMEye port 34567, Hikvision SDK port 8000)

Scan infrastructure: Distributed nodes across Indian were utilized, completing the full address space in approximately under 1 hour minutes.

## Regulatory References

- [Gazette Notification (7 March & 9 April 2024)](https://www.mha.gov.in/sites/default/files/CCTV_30042024.pdf) — PPO amendment and CRO amendment for CCTV systems
- [MeitY Office Memorandum (4 February 2026)](https://www.csir.res.in/sites/default/files/2026-02/ppp_certificatew_waiver-04.02.2025-dsc.pdf) — No. W-18/26/2025-IPHW, withdrawing all transition relaxations
- [PIB Press Release (25 March 2026)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245073&reg=3&lang=1) — Strengthened legal framework for CCTV security
- [STQC Certified Products](https://www.stqc.gov.in/en/iot-system-certification-scheme-iotscs-0) — IoT System Certification Scheme (IoTSCS)
- [STQC Empanelled Laboratories](https://stqc.gov.in/en/stqc-empanelled-test-laboratories)

## Technical Details

Fully static site. No backend, no databases, no user input, no runtime API calls.

- D3.js for SVG map rendering with GeoJSON boundaries
- Choropleth coloring by camera density per state
- Geo-positioned camera markers by vendor
- Click-through detail modals for states and cities
- Dark/light theme toggle with persistent preference
- Responsive design (desktop, tablet, mobile)
- Content Security Policy enforced

### File Structure

```
index.html          Page structure
css/styles.css      Styling with dark mode support
js/geodata.js       India GeoJSON (state boundaries)
js/data.js          Scan results (camera locations, vendor data, ISP breakdown)
js/map.js           D3 visualization, modals, interactivity
```
