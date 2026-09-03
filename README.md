# Hinton → Clearwater offline audio guide

A GPS-triggered audio guide for the drive from Hinton, Alberta to Clearwater,
British Columbia via the Yellowhead Highway 16 and Highway 5 — about 440 km.

It is a web app, not a native iOS app, because it has to work **today**: no
Xcode, no developer account, no App Store review. Add it to the iPhone home
screen and it behaves like an app.

36 narrated stops fire automatically as you drive past them. Once the page has
been opened once with a network connection, **nothing else needs a network** —
no data, no cell signal, no GPS assistance server.

## Getting it onto the phone

1. The repository must be **public** (GitHub Pages is not available on private
   repositories on the free plan), and Pages must be enabled once by hand:
   **Settings → Pages → Build and deployment → Source: GitHub Actions**. The
   workflow's built-in token is not permitted to create the Pages site itself,
   so this step cannot be automated. After that,
   `.github/workflows/pages.yml` publishes on every push to `main`.
2. Open the published URL in **Safari on the iPhone**, while on Wi-Fi.
3. **Share → Add to Home Screen.** This is what makes it run full-screen and
   keeps the cache from being evicted.
4. Open it from the home screen once, still on Wi-Fi, and tap **Start the
   guide**, then stop it. That installs the service worker and caches
   everything.

After step 4 the guide is fully self-contained.

## Using it in the car

Tap **Start the guide** before you pull away. That single tap does three things
iOS only permits from a user gesture: grants location access, unlocks audio
playback, and requests a screen wake lock.

Then:

- **Connect the car stereo first** (Bluetooth or cable) so narration comes out
  of the speakers.
- **Set Auto-Lock to Never** — Settings → Display & Brightness → Auto-Lock.
  This is the one real limitation: iOS suspends web pages when the phone locks,
  so the screen has to stay on. Mount the phone and keep it charging.
- The opening briefing plays as soon as you start, which doubles as a check
  that audio is reaching the speakers.

## How stops trigger

Each stop has a coordinate, a radius, and a `km` marker for its position along
the route. A stop plays when either:

1. you come within its radius, or
2. **closest approach** — you got reasonably near and are now moving away
   again. This is the safety net for a coordinate that sits slightly off the
   driving line, and it means a stop still plays as you pass it rather than
   being missed silently.

Simultaneous triggers are narrated in route order, not by distance, so you
never hear Clearwater before Vavenby. If several stops back up behind the one
playing, the ones furthest behind are dropped from the queue and marked
*passed* in the list — tappable, but not narrated at you twenty minutes late.

Progress is saved to `localStorage`, so closing the app mid-drive and reopening
it does not replay everything.

## Voice

Narration uses the iPhone's built-in speech synthesis, which runs entirely
on-device. Pick a voice under **Settings & voice** — the enhanced Siri voices
sound considerably better than the default and are worth downloading before you
leave (Settings → Accessibility → Spoken Content → Voices).

There are no audio files to download; the text is spoken on demand. That is
what keeps the whole guide under 100 KB.

## Testing before you leave

**Settings & voice → Test drive** simulates the entire route in a couple of
minutes so you can hear the voice, check the volume, and confirm stops fire.

The test drive runs against a scratch copy of your progress and restores it
when you stop, so testing the night before does not leave the guide silent on
the actual drive. If saved progress is more than six hours old, the start
screen offers to clear it.

## Editing the route

All content is in `js/route.js` — one array of stops, each with `name`,
`subtitle`, `lat`, `lon`, `radius` (metres), `km`, and `text`. Add, remove or
reword freely; nothing else needs to change.

Coordinates were placed by hand on the highway corridor and are approximate,
typically good to a kilometre. Radii are deliberately generous (2.5–4.5 km) and
the closest-approach rule covers the rest.

## Layout

```
index.html              UI shell, styles
js/route.js             all 36 stops and their narration
js/app.js               GPS watch, trigger engine, speech queue
sw.js                   service worker — precaches everything for offline use
manifest.webmanifest    home-screen install metadata
```

No dependencies, no build step, no network calls at runtime. Nothing about your
location leaves the phone.
