#!/usr/bin/env python3
"""Génère le dossier de présentation de Kandys Pâtisserie — UNE seule page A4.

Usage :  python3 tools/generate_dossier.py
Sortie :  dossier/kandys-patisserie-dossier.pdf

Dépendances : reportlab, qrcode, pillow
Polices     : Playfair Display + Lato (SIL Open Font License, cf. tools/fonts/)
"""

from __future__ import annotations

from pathlib import Path

import qrcode
from PIL import Image, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
FONTS = ROOT / "tools" / "fonts"
OUT = ROOT / "dossier" / "kandys-patisserie-dossier.pdf"
BUILD = Path("/tmp/kandys-dossier-build")

SITE_URL = "https://kandys-patisserie.vercel.app"
SITE_LABEL = "kandys-patisserie.vercel.app"
PHONE_1 = "+225 01 02 15 04 03"
PHONE_2 = "+225 05 84 16 20 72"
WHATSAPP = "+225 01 02 15 03 03"
STUDIO = "Shopin30"
STUDIO_WA = "+225 05 01 30 33 43"

W, H = A4

WINE = HexColor("#570D2B")
WINE_DARK = HexColor("#3C0B20")
WINE_SOFT = HexColor("#762444")
GOLD = HexColor("#C5A15A")
GOLD_LIGHT = HexColor("#E8D7AD")
CREAM = HexColor("#FBF8F0")
PAPER = HexColor("#FFFDF8")
SAND = HexColor("#F0EADC")
INK = HexColor("#2C2022")
MUTED = HexColor("#756D67")
LINE = HexColor("#E4DAC6")

FONT_FILES = {
    "Playfair-Regular": "Playfair-Regular.ttf",
    "Playfair-Medium": "Playfair-Medium.ttf",
    "Playfair-SemiBold": "Playfair-SemiBold.ttf",
    "Playfair-Bold": "Playfair-Bold.ttf",
    "Playfair-Italic": "Playfair-Italic.ttf",
    "Lato": "Lato-Regular.ttf",
    "Lato-Bold": "Lato-Bold.ttf",
    "Lato-Black": "Lato-Black.ttf",
    "Lato-Italic": "Lato-Italic.ttf",
}
for name, filename in FONT_FILES.items():
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))


# ------------------------------------------------------------------ helpers --
def spaced(c, text, x, y, font, size, color, tracking=1.6, align="left"):
    width = pdfmetrics.stringWidth(text, font, size) + tracking * max(0, len(text) - 1)
    if align == "center":
        x -= width / 2
    elif align == "right":
        x -= width
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(tracking)
    t.textOut(text)
    t.setCharSpace(0)
    c.drawText(t)


def wrap(text, font, size, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if pdfmetrics.stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def diamond(c, x, y, r=2.2, color=GOLD):
    p = c.beginPath()
    p.moveTo(x, y + r)
    p.lineTo(x + r, y)
    p.lineTo(x, y - r)
    p.lineTo(x - r, y)
    p.close()
    c.setFillColor(color)
    c.drawPath(p, fill=1, stroke=0)


def cover_crop(path, width_px, height_px):
    img = Image.open(path).convert("RGB")
    src_ratio = img.width / img.height
    dst_ratio = width_px / height_px
    if src_ratio > dst_ratio:
        new_w = int(img.height * dst_ratio)
        left = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        new_h = int(img.width / dst_ratio)
        top = (img.height - new_h) // 3
        img = img.crop((0, top, img.width, top + new_h))
    return img.resize((width_px, height_px), Image.LANCZOS)


def draw_photo(c, path, x, y, w, h, radius=5, quality=86):
    px_w = 620
    px_h = max(1, int(px_w * h / w))
    tmp = BUILD / (Path(path).stem + ".jpg")
    cover_crop(path, px_w, px_h).save(tmp, "JPEG", quality=quality,
                                       optimize=True, progressive=True)
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, radius)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(str(tmp)), x, y, w, h)
    c.restoreState()


def draw_qr(c, url, x, y, size):
    qr = qrcode.QRCode(box_size=12, border=0,
                       error_correction=qrcode.constants.ERROR_CORRECT_M)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#570D2B", back_color="#FFFFFF").convert("RGB")
    img = img.resize((size * 4, size * 4), Image.NEAREST)
    path = BUILD / "qr.png"
    img.save(path)
    c.drawImage(ImageReader(str(path)), x, y, size, size)


# --------------------------------------------------------------------- page --
def build():
    BUILD.mkdir(parents=True, exist_ok=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Kandys Pâtisserie — Dossier de présentation")
    c.setAuthor("Kandys Pâtisserie")
    c.setSubject("Prestations, réalisations, coordonnées et accès au site par QR code")
    c.setKeywords("Kandys Pâtisserie, Daloa, restaurant, pâtisserie, site web, QR code")
    c.setCreator(f"Conçu par {STUDIO} · WhatsApp {STUDIO_WA}")

    # fond + double cadre doré
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.rect(28, 28, W - 56, H - 56, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.rect(28, 28, W - 56, H - 56, fill=0, stroke=1)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.5)
    c.rect(35, 35, W - 70, H - 70, fill=0, stroke=1)

    left, right = 56, W - 56
    inner = right - left

    # ------------------------------------------------------------- en-tête ---
    msize, mx, my = 44, left, H - 60 - 44
    c.setFillColor(WINE)
    c.rect(mx, my, msize, msize, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.setDash(1, 2)
    c.rect(mx + 4, my + 4, msize - 8, msize - 8, fill=0, stroke=1)
    c.setDash()
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Playfair-SemiBold", 17)
    c.drawCentredString(mx + msize / 2, my + 13, "KP")

    tx = mx + msize + 15
    c.setFillColor(WINE_DARK)
    c.setFont("Playfair-SemiBold", 22)
    c.drawString(tx, H - 76, "Kandys Pâtisserie")
    spaced(c, "RESTAURANT  ·  PÂTISSERIE  ·  DALOA", tx, H - 92,
           "Lato-Bold", 7.2, GOLD, tracking=2.0)

    c.setFillColor(MUTED)
    c.setFont("Lato", 7.4)
    c.drawRightString(right, H - 74, "Commandes sur WhatsApp")
    c.setFillColor(WINE_SOFT)
    c.setFont("Lato-Bold", 7.6)
    c.drawRightString(right, H - 88, WHATSAPP)

    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(left, H - 108, right, H - 108)
    diamond(c, W / 2, H - 108, 3, GOLD)

    # --------------------------------------------------------- accroche ------
    c.setFillColor(WINE_DARK)
    c.setFont("Playfair-Italic", 15.5)
    c.drawCentredString(W / 2, H - 132, "Le goût du partage, la touche Kandys.")
    c.setFillColor(MUTED)
    c.setFont("Lato", 8.2)
    c.drawCentredString(
        W / 2, H - 147,
        "Plats africains et européens, entrées gourmandes, jus frais et gâteaux de fête — à Daloa.")

    # ------------------------------------------------------------- photos ---
    photos = [
        (ASSETS / "plats-africains-assortiment.jpg", "Cuisine africaine"),
        (ASSETS / "entree-oeufs-mimosa.jpg", "Entrées gourmandes"),
        (ASSETS / "gateau-mariage-reference.jpg", "Gâteaux de fête"),
    ]
    gap = 11
    ph_w = (inner - 2 * gap) / 3
    ph_h = 132
    ph_top = H - 164
    for i, (path, caption) in enumerate(photos):
        x = left + i * (ph_w + gap)
        draw_photo(c, path, x, ph_top - ph_h, ph_w, ph_h, radius=6)
        spaced(c, caption.upper(), x + ph_w / 2, ph_top - ph_h - 12,
               "Lato-Bold", 6.4, WINE_SOFT, tracking=1.3, align="center")

    # -------------------------------------------------- six univers ----------
    univers_top = ph_top - ph_h - 44
    spaced(c, "NOS SIX UNIVERS", left, univers_top, "Lato-Bold", 6.6, WINE_SOFT, 1.7)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.7)
    c.line(left + pdfmetrics.stringWidth("NOS SIX UNIVERS", "Lato-Bold", 6.6) + 22,
           univers_top + 2, right, univers_top + 2)

    univers = [
        ("01", "Plats africains", "Attiéké, braisés, sauces et accompagnements."),
        ("02", "Plats européens", "Recettes conviviales et bouchées salées."),
        ("03", "Entrées", "Œufs mimosa, mini-pizzas, rouleaux croustillants."),
        ("04", "Jus", "Préparés sur place, frais et fruités."),
        ("05", "Gâteaux de mariage", "Pièces montées sur mesure, décorées à votre thème."),
        ("06", "Gâteaux d’anniversaire", "Créations personnalisées pour chaque âge."),
    ]
    u_col_w = (inner - 12) / 2
    u_row_h = 46
    for i, (num, title, desc) in enumerate(univers):
        col = i % 2
        row = i // 2
        x = left + col * (u_col_w + 12)
        y = univers_top - 18 - row * u_row_h
        c.setFillColor(SAND)
        c.roundRect(x, y - u_row_h + 13, u_col_w, u_row_h - 8, 5, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.setFont("Lato-Black", 7.4)
        c.drawString(x + 10, y - 1, num)
        c.setFillColor(WINE_DARK)
        c.setFont("Playfair-SemiBold", 9.4)
        c.drawString(x + 26, y - 1, title)
        c.setFillColor(MUTED)
        c.setFont("Lato", 6.9)
        c.drawString(x + 26, y - 11, desc)

    # ------------------------------------------------- bloc QR + contacts ----
    block_top = univers_top - 18 - 3 * u_row_h - 16
    qr_size = 100
    pad = 8
    frame = qr_size + 2 * pad
    c.setFillColor(HexColor("#FFFFFF"))
    c.roundRect(left, block_top - frame, frame, frame, 6, fill=1, stroke=0)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.8)
    c.roundRect(left, block_top - frame, frame, frame, 6, fill=0, stroke=1)
    draw_qr(c, SITE_URL, left + pad, block_top - qr_size - pad, qr_size)

    qx = left + frame + 16
    mid_w = 150
    spaced(c, "DÉCOUVREZ NOTRE SITE", qx, block_top - 8, "Lato-Bold", 6.6, WINE_SOFT, 1.5)
    c.setFillColor(WINE_DARK)
    c.setFont("Playfair-SemiBold", 11.4)
    c.drawString(qx, block_top - 24, "Scannez, puis commandez")
    c.setFillColor(MUTED)
    ty = block_top - 39
    for line in wrap("Prestations, réalisations et formulaire de commande en ligne.",
                     "Lato", 7.2, mid_w):
        c.setFont("Lato", 7.2)
        c.drawString(qx, ty, line)
        ty -= 9.2
    c.setFillColor(WINE)
    c.setFont("Lato-Bold", 8)
    c.drawString(qx, ty - 3, SITE_LABEL)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(qx, ty - 6.5, qx + pdfmetrics.stringWidth(SITE_LABEL, "Lato-Bold", 8), ty - 6.5)

    cx = left + frame + 16 + mid_w + 16
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.line(cx - 12, block_top, cx - 12, block_top - frame)
    spaced(c, "COMMANDES & RENSEIGNEMENTS", cx, block_top - 8,
           "Lato-Bold", 6.2, WINE_SOFT, 1.2)
    cy = block_top - 24
    for label, value, color in (
        ("Téléphone 1", PHONE_1, INK),
        ("Téléphone 2", PHONE_2, INK),
        ("WhatsApp du restaurant", WHATSAPP, WINE),
        ("Adresse", "Daloa · Côte d’Ivoire", INK),
    ):
        c.setFillColor(MUTED)
        c.setFont("Lato", 6.6)
        c.drawString(cx, cy, label)
        c.setFillColor(color)
        c.setFont("Lato-Bold", 8.4)
        c.drawString(cx, cy - 10, value)
        cy -= 23

    # ------------------------------------------------------- bandeau CTA -----
    band_h = 54
    band_top = 206
    c.setFillColor(WINE)
    c.roundRect(left, band_top - band_h, inner, band_h, 7, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.roundRect(left + 5, band_top - band_h + 5, inner - 10, band_h - 10, 5,
                fill=0, stroke=1)
    c.setFillColor(PAPER)
    c.setFont("Playfair-SemiBold", 12.4)
    c.drawString(left + 18, band_top - 22, "Une envie ? Parlons-en sur WhatsApp.")
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Lato", 7.2)
    c.drawString(left + 18, band_top - 35,
                 "Un plat, des entrées ou un gâteau de fête : votre message est préparé pour vous.")
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Lato-Black", 12.6)
    c.drawRightString(right - 18, band_top - 24, WHATSAPP)
    spaced(c, "COMMANDES", right - 18, band_top - 36, "Lato-Bold", 6.2, GOLD,
           tracking=1.4, align="right")

    # ------------------------------------------------------------- pied -----
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.7)
    c.line(left, 126, right, 126)
    foot_y = 106
    c.setFillColor(MUTED)
    c.setFont("Lato", 7.2)
    c.drawCentredString(
        W / 2, foot_y,
        "Site conçu par Shopin30  ·  WhatsApp " + STUDIO_WA
        + "  ·  pour commander votre propre site internet")
    c.setFillColor(WINE_SOFT)
    c.setFont("Lato-Bold", 6.4)
    spaced(c, "KANDYS PÂTISSERIE  ·  DALOA, CÔTE D’IVOIRE", W / 2, foot_y - 14,
           "Lato-Bold", 6.4, WINE_SOFT, 1.6, align="center")

    c.showPage()
    c.save()
    return OUT


if __name__ == "__main__":
    path = build()
    pages = "?"
    try:
        import pymupdf  # vérification facultative

        pages = pymupdf.open(str(path)).page_count
    except Exception:
        pass
    size = path.stat().st_size / 1024
    print(f"OK → {path} ({size:.0f} Ko, {pages} page(s))")
