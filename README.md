# Food Opinion Wall: Interactive and Social Feedback for Self-Service Restaurants
Food Opinion Wall is a real-time, touch-based opinion wall deployed in self-service restaurant settings as part of a research experiment on diner feedback. Visitors can rate their meal using emoji-driven quick opinions, which appear as animated floating bubbles on a large ambient LCD display. The system was designed to make giving feedback feel effortless and social — more like dropping a hot take than filling out a form.

---

## Research Context

This software was developed and deployed as part of a study validating novel communication and feedback channels in everyday public self-service dining environments.

**Deployment period:** 29 September – 10 October 2025

**Deployment sites (anonymized):**
- **Restaurant A** — Turku, Finland
- **Restaurant B** — Turku, Finland

Both restaurants operated a dedicated touchscreen kiosk running the opinion wall. An additional QR code allowed diners to submit opinions from their own mobile devices, extending the feedback channel beyond the physical screen.

By interacting with the system, participants consented to their responses being used for research purposes. No personally identifiable information was collected.

---

### Deployment Screenshots
 
| Restaurant A | Restaurant B |
|:---:|:---:|
| ![Opinion wall deployed at Restaurant A](Restaurant%20A/landingpage.png) | ![Opinion wall deployed at Restaurant B](Restaurant%20B/landingpage.png) |
 
---

## What the System Does

The Food Opinion Wall presents diners with a simple two-step interaction:

1. **Select a meal type** — e.g. Lunch, Weigh & Dine, or Grill (configurable per venue).
2. **Tap a quick opinion** — 12 emoji-labelled tiles cover a range of sensory and hedonic dimensions:

 | Positive | Neutral | Critical |
   |----------|---------|----------|
   | Tasty | Ordinary | Bland |
   | Delicious | Filling | Dry |
   | Fresh | | Too salty |
   | Juicy | | Cold |
   | Well seasoned | | Heavy |

Submitted opinions instantly appear as animated, glowing bubbles on the ambient display above the input panel, creating a live social proof effect visible to other diners in the space. A running count of submissions ("hot takes") is shown in the bottom bar.

---

## Features

- **Live opinion feed**: Opinions float up on screen in real time, visible to everyone in the restaurant
- **Multi-station support**: Each screen can be configured for multiple meal type offerings simultaneously
- **QR code entry** — Diners can submit opinions on their phone by scanning a QR code, without interacting with the kiosk
- **Opinion counters** — Submission counts displayed at a glance
- **Ambient display mode** — The floating bubble visualisation is designed to function as an unobtrusive ambient display when no one is actively interacting
- **Multilingual interface** — UI supports multiple languages (Finnish / English shown in deployment)

---

## Repository Structure

```
{root}/
├── Restaurant A/          # Code repository for the version that was deployed at Restaurant A
├── Restaurant B/      # Code repository for the version that was deployed at Restaurant B
```

---

## Setup & Deployment

> Detailed software deployment instructions are provided in ```README.md``` file of each subfolder corresponding to the deployment at each restaurant.

At a high level, each installation requires:

1. A touchscreen display (landscape orientation recommended) connected to a local machine or network.
2. A network connection for real-time opinion relay between the kiosk and the server.
3. A QR code generated from the venue-specific URL and printed or displayed near the kiosk.
4. An API endpoint for inserting and querying data.

---

## Acknowledgement
This research was supported by Business Finland, under the Veturi program with the Dining Flow project (6547/31/2022). We acknowledge the Flavoria Research Platform, Antell and our colleagues at University of Turku for their continued support and contributions to the study. More about the Dining Flow project at University of Turku [here](https://sites.utu.fi/diningflow/).

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21696933.svg)](https://doi.org/10.5281/zenodo.21696933)

