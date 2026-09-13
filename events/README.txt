Drop any flyer image (jpg, jpeg, png, or webp) in this folder and it shows
up automatically on the Upcoming Events page — no special filename needed.

The title shown on the site comes from the filename (hyphens/underscores
become spaces, e.g. "drive-through.jpg" -> "Drive Through"). Flyers are
listed alphabetically by filename — prefix with a number if you want to
control the order (e.g. 1-drive-through.jpg, 2-picnic.jpg).

OPTIONAL — expiry date: if you want a flyer to automatically stop showing
after its event has passed, name the file <slug>_<YYYY-MM-DD>.jpg, e.g.
    drive-through_2026-10-12.jpg
The date is the flyer's expiry date. Without a date suffix, the flyer just
stays up indefinitely.

After adding a file here and pushing to GitHub, a GitHub Action
automatically regenerates events.json and the new flyer appears on
/events.html. To test locally before pushing, run:
    python scripts/build_events.py
