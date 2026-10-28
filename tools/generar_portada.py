"""Genera una portada legible con un acento decorativo de menos de tres segundos."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)
FONTS = Path("C:/Windows/Fonts")
base = Image.new("RGB", (1200, 300), "#102435")
draw = ImageDraw.Draw(base)
draw.rectangle((0, 0, 9, 300), fill="#65d7c2")
draw.text((46, 28), "PORTAFOLIO  /  2025 — 2026", font=ImageFont.truetype(str(FONTS / "segoeui.ttf"), 19), fill="#9fc5d4")
draw.text((43, 65), "Axel Castañeda Sánchez", font=ImageFont.truetype(str(FONTS / "georgiab.ttf"), 53), fill="#ffffff")
draw.text((46, 151), "PYTHON  ·  DATOS  ·  DESARROLLO WEB", font=ImageFont.truetype(str(FONTS / "segoeuib.ttf"), 23), fill="#65d7c2")
draw.text((46, 205), "Aplicaciones, automatización y colaboración con evidencia.", font=ImageFont.truetype(str(FONTS / "segoeui.ttf"), 21), fill="#d3e0e8")
draw.line((46, 267, 1150, 267), fill="#294d63", width=2)
base.save(ASSETS / "portada.png")

frames = []
for index in range(24):
    frame = base.copy()
    pen = ImageDraw.Draw(frame)
    x = round(46 + 1104 * index / 23)
    pen.line((46, 267, x, 267), fill="#65d7c2", width=2)
    pen.ellipse((x - 4, 263, x + 4, 271), fill="#65d7c2")
    frames.append(frame)

# Sin parámetro loop: el GIF se reproduce una sola vez y conserva el texto estático.
gif_path = ASSETS / "portada.gif"
frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=120, optimize=True)
with Image.open(gif_path) as gif:
    assert gif.size == (1200, 300)
    assert gif.n_frames == 24
    assert "loop" not in gif.info
    duration = 0
    for index in range(gif.n_frames):
        gif.seek(index)
        duration += gif.info["duration"]
    assert duration == 2880
assert gif_path.stat().st_size < 500_000
print(f"Portada verificada: 1200x300, 24 cuadros, {duration} ms, una reproducción, {gif_path.stat().st_size} bytes")
