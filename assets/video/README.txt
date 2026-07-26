Drop the venue reel video here with this EXACT filename:

    trisara-reel.mp4

That's it — index.html already points to assets/video/trisara-reel.mp4,
so once the file is in this folder with that name, it will just play.
No other changes needed.

Notes:
- Video should be vertical (9:16), matching a phone/Reels-style clip.
- Keep the file reasonably compressed (a few MB, not 100s of MB) or it
  will load slowly on the live site. HandBrake or a quick
  "ffmpeg -i input.mp4 -vcodec libx264 -crf 28 trisara-reel.mp4"
  works well if the source file is large.
- If the file isn't present, the site still works fine — it just shows
  the poster image (an evening lawn photo) in that section instead.
