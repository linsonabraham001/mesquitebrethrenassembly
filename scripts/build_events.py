"""
Scans events/ and regenerates events.json.

Just drop any image file (jpg, jpeg, png, webp) into events/ and it will
show up on the Upcoming Events page — no naming convention required. The
title shown is derived from the filename (hyphens/underscores become
spaces, title-cased); flyers are listed alphabetically by filename, so prefix
filenames with a number (e.g. 1-drive-through.jpg, 2-picnic.jpg) if you
want to control the order.

Optional: to set an expiry date so a flyer disappears automatically after
the event has passed, name the file <slug>_<YYYY-MM-DD>.jpg — the date is
treated as the expiry date. Without a date suffix, the flyer just stays up
indefinitely.

Example: drive-through.jpg          -> title "Drive Through", no expiry
Example: drive-through_2026-10-12.jpg -> title "Drive Through", expires 2026-10-12

Run manually with `python scripts/build_events.py`, or let the
"Build events manifest" GitHub Action run it automatically whenever a file
under events/ changes.
"""

import json
import os
import re

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVENTS_DIR = os.path.join(REPO_ROOT, "events")
OUTPUT_PATH = os.path.join(REPO_ROOT, "events.json")

IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
DATE_SUFFIX_PATTERN = re.compile(r"^(?P<slug>.+)_(?P<date>\d{4}-\d{2}-\d{2})$")


def title_from_slug(slug):
    return slug.replace("-", " ").replace("_", " ").strip().title()


def main():
    events = []

    if os.path.isdir(EVENTS_DIR):
        for name in sorted(os.listdir(EVENTS_DIR)):
            stem, dot, ext = name.rpartition(".")
            if not dot or ext.lower() not in IMAGE_EXTENSIONS:
                continue

            date_match = DATE_SUFFIX_PATTERN.match(stem)
            slug = date_match.group("slug") if date_match else stem

            event = {
                "image": "events/" + name,
                "title": title_from_slug(slug),
            }
            if date_match:
                event["expires"] = date_match.group("date")

            events.append(event)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2)
        f.write("\n")

    print("Wrote {} event(s) to {}".format(len(events), OUTPUT_PATH))


if __name__ == "__main__":
    main()
