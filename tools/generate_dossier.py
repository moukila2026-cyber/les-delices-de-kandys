#!/usr/bin/env python3
"""Génère le dossier de présentation PDF du site Les Délices de Kandys.

Usage :  python3 tools/generate_dossier.py
Sortie :  dossier/les-delices-de-kandys-dossier.pdf

Dépendances : reportlab, qrcode, pillow
Polices     : Playfair Display + Lato (SIL Open Font License, cf. tools/fonts/)
"""

from __future__ import annotations

import os
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageOps
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
FONTS = ROOT / "tools" / "fonts"
OUT = ROOT / "dossier" / "les-delices-de-kandys-dossier.pdf"
BUILD = Path("/tmp/dk-pdf-build")

SITE_URL = "https://les-delices-de-kandys.vercel.app"
SITE_LABEL = "les-delices-de-kandys.vercel.app"
PHONE_1 = "+225 01 02 15 04 03"
PHONE_2 = "+225 05 84 16 20 72"
WHATSAPP = "+225 01 02 15 03 03"

W, H = A4

# ---------------------------------------------------------------- palette ---
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

# ------------------------------------------------------------------ fonts ---
FONT_FILES = {
    "Playfair": "Playfair-Medium.ttf",
    "Playfair-Regular": "Playfair-Regular.ttf",
    "Playfair-Medium": "Playfair-Medium.ttf",
    "Playfair-Bold": "Playfair-Bold.ttf",
    "Playfair-Italic": "Playfair-Italic.ttf",
    "Playfair-MediumItalic": "Playfair-MediumItalic.ttf",
    "Lato": "Lato-Regular.ttf",
    "Lato-Italic": "Lato-Italic.ttf",
    "Lato-Bold": "Lato-Bold.ttf",
    "Lato-Black": "Lato-Black.ttf",
}

for name, filename in FONT_FILES.items():
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))

# ----------------------------------------------------------------- styles ---
def st(name, font, size, leading, color, align=TA_LEFT, space=0):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=space,
    )


S = {
    "eyebrow": st("eyebrow", "Lato-Bold", 7.4, 9, WINE_SOFT),
    "eyebrow_light": st("eyebrow_light", "Lato-Bold", 7.4, 9, GOLD_LIGHT),
    "h1": st("h1", "Playfair-Medium", 30, 33, WINE_DARK),
    "h1_center": st("h1_center", "Playfair-Medium", 30, 33, WINE_DARK, TA_CENTER),
    "lead": st("lead", "Lato", 9.6, 15.4, MUTED),
    "lead_center": st("lead_center", "Lato", 9.6, 15.4, MUTED, TA_CENTER),
    "body": st("body", "Lato", 9.2, 14.4, MUTED),
    "body_ink": st("body_ink", "Lato", 9.2, 14.4, INK),
    "card_title": st("card_title", "Playfair-Medium", 12.4, 14.6, WINE_DARK),
    "card_title_light": st("card_title_light", "Playfair-Medium", 12.4, 14.6, PAPER),
    "card_desc": st("card_desc", "Lato", 8.1, 11.9, MUTED),
    "card_desc_light": st("card_desc_light", "Lato", 8.1, 11.9, HexColor("#EBDCD3")),
    "small": st("small", "Lato", 7.4, 10.6, MUTED),
    "small_light": st("small_light", "Lato", 7.4, 10.6, HexColor("#E4D2C6")),
    "bullet_title": st("bullet_title", "Lato-Bold", 8.8, 11.4, INK),
    "bullet_desc": st("bullet_desc", "Lato", 7.9, 11.2, MUTED),
    "caption": st("caption", "Playfair-Italic", 9.6, 11.5, WINE_DARK),
    "label": st("label", "Lato-Bold", 6.3, 8, GOLD),
    "value": st("value", "Lato-Bold", 8.3, 10.6, INK),
}


# ---------------------------------------------------------------- helpers ---
def para(c, text, x, top, width, style):
    """Dessine un paragraphe, retourne sa hauteur."""
    p = Paragraph(text, style)
    _, h = p.wrap(width, 10000)
    p.drawOn(c, x, top - h)
    return h


def spaced(c, text, x, y, font, size, color, tracking=1.6, align="left"):
    """Texte avec interlettrage (letter-spacing) et alignement optionnel."""
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
    t.setCharSpace(0)  # remet l'interlettrage à zéro pour les textes suivants
    c.drawText(t)


def diamond(c, x, y, r=2.4, color=GOLD):
    p = c.beginPath()
    p.moveTo(x, y + r)
    p.lineTo(x + r, y)
    p.lineTo(x, y - r)
    p.lineTo(x - r, y)
    p.close()
    c.setFillColor(color)
    c.drawPath(p, fill=1, stroke=0)


def gold_rule(c, cx, y, width=64, color=GOLD, with_diamond=True):
    c.setStrokeColor(color)
    c.setLineWidth(0.7)
    c.line(cx - width / 2, y, cx - 9, y)
    c.line(cx + 9, y, cx + width / 2, y)
    if with_diamond:
        diamond(c, cx, y, 2.2, color)


def eyebrow(c, text, x, y, color=WINE_SOFT, rule=True):
    if rule:
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.7)
        c.line(x, y + 3, x + 20, y + 3)
        x += 29
    spaced(c, text, x, y, "Lato-Bold", 7.4, color, 1.7)


def dashed_ring(c, x, y, r, color=GOLD, width=0.5, alpha=None):
    c.saveState()
    if alpha is not None:
        c.setStrokeAlpha(alpha)
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.setDash(2.2, 3.2)
    c.circle(x, y, r, stroke=1, fill=0)
    c.restoreState()


def prepared_image(src, width_pt, height_pt, scale=2.6, center=(0.5, 0.5), quality=88):
    """Recadre et compresse le visuel en JPEG (cache local) pour alléger le PDF."""
    BUILD.mkdir(parents=True, exist_ok=True)
    key = f"{src.stem}-{int(width_pt)}x{int(height_pt)}-{int(center[1]*100)}"
    out = BUILD / f"{key}.jpg"
    if not out.exists():
        im = Image.open(src).convert("RGB")
        px = (max(1, int(width_pt * scale)), max(1, int(height_pt * scale)))
        im = ImageOps.fit(im, px, Image.LANCZOS, centering=center)
        im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    return str(out)


def place_image(c, src, x, y, w, h, radius=7, center=(0.5, 0.5), scale=2.6):
    """Image aux coins arrondis dont (x, y) est le coin inférieur gauche."""
    path = prepared_image(src, w, h, scale, center)
    c.saveState()
    clip = c.beginPath()
    clip.roundRect(x, y, w, h, radius)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(path, x, y, w, h, preserveAspectRatio=False, mask=None)
    c.restoreState()


def shadow_card(c, x, y, w, h, fill=PAPER, border=LINE, radius=11, shadow=True):
    if shadow:
        c.setFillColor(HexColor("#E9E0CC"))
        c.roundRect(x + 1.6, y - 2.4, w, h, radius, stroke=0, fill=1)
    c.setFillColor(fill)
    c.setStrokeColor(border)
    c.setLineWidth(0.7)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)


# ------------------------------------------------------------------ pages ---
PAGES = 6
M = 52  # marge


def page_frame(c, number, dark=False, bg=CREAM):
    c.setFillColor(bg)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    fg = HexColor("#8C7A72") if not dark else HexColor("#C4A896")
    c.setStrokeColor(GOLD if dark else HexColor("#DCCFB4"))
    c.setLineWidth(0.6)
    c.line(M, 44, W - M, 44)
    spaced(
        c,
        "LES DÉLICES DE KANDYS  ·  DALOA",
        M,
        31,
        "Lato-Bold",
        6.4,
        fg,
        1.35,
    )
    spaced(
        c,
        f"{number:02d} / {PAGES:02d}",
        W - M,
        31,
        "Lato-Bold",
        6.4,
        GOLD if not dark else GOLD_LIGHT,
        1.35,
        align="right",
    )


def section_head(c, kicker, title_lines, lead, y=H - 74, center=False, width=430):
    """En-tête de section : kicker, titre (plusieurs lignes), chapô."""
    x = M
    if center:
        eyebrow_y = y
        tw = pdfmetrics.stringWidth(kicker, "Lato-Bold", 7.4) + 1.7 * (len(kicker) - 1)
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.7)
        c.line(W / 2 - tw / 2 - 40, eyebrow_y + 3, W / 2 - tw / 2 - 9, eyebrow_y + 3)
        c.line(W / 2 + tw / 2 + 9, eyebrow_y + 3, W / 2 + tw / 2 + 40, eyebrow_y + 3)
        spaced(c, kicker, W / 2, eyebrow_y, "Lato-Bold", 7.4, WINE_SOFT, 1.7, align="center")
        y -= 26
        for txt_line, style in title_lines:
            h = para(c, txt_line, x, y, W - 2 * M, style)
            y -= h + 1
        y -= 12
        h = para(
            c,
            lead,
            W / 2 - width / 2,
            y,
            width,
            S["lead_center"],
        )
        return y - h
    eyebrow(c, kicker, x, y)
    y -= 27
    for txt_line, style in title_lines:
        h = para(c, txt_line, x, y, W - 2 * M, style)
        y -= h + 1
    y -= 13
    h = para(c, lead, x, y, width, S["lead"])
    return y - h


def page_cover(c):
    c.setFillColor(WINE_DARK)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # halo décoratif
    c.saveState()
    for r, wd, alpha in ((250, 0.6, 0.22), (310, 0.5, 0.12)):
        c.setStrokeAlpha(alpha)
        c.setStrokeColor(GOLD)
        c.setLineWidth(wd)
        c.circle(W / 2, H - 150, r, stroke=1, fill=0)
    c.restoreState()

    dashed_ring(c, W / 2, H - 150, 355, GOLD, 0.5, 0.18)

    # cadre doré
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.rect(26, 26, W - 52, H - 52, stroke=1, fill=0)
    c.setLineWidth(0.4)
    c.rect(32, 32, W - 64, H - 64, stroke=1, fill=0)

    top = H - 108
    # monogramme
    cx, cy = W / 2, top - 6
    c.setFillColor(WINE)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.circle(cx, cy, 27, stroke=1, fill=1)
    c.setLineWidth(0.4)
    c.setStrokeColor(GOLD_LIGHT)
    c.circle(cx, cy, 22.5, stroke=1, fill=0)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Playfair-Medium", 16)
    c.drawCentredString(cx, cy - 5.5, "DK")

    spaced(
        c,
        "RESTAURANT   ·   PÂTISSERIE   ·   DALOA",
        W / 2,
        top - 72,
        "Lato-Bold",
        7.6,
        GOLD,
        2.1,
        align="center",
    )

    # titre
    c.setFillColor(PAPER)
    c.setFont("Playfair-Regular", 40)
    c.drawCentredString(W / 2, H - 292, "Les Délices")
    c.setFillColor(GOLD_LIGHT)
    c.setFont("Playfair-MediumItalic", 44)
    c.drawCentredString(W / 2, H - 343, "de Kandys")

    gold_rule(c, W / 2, H - 370, 96, GOLD)

    c.setFillColor(HexColor("#F3E4CE"))
    c.setFont("Playfair-Italic", 13)
    c.drawCentredString(W / 2, H - 396, "Le goût du partage, la touche Kandys.")

    spaced(
        c,
        "DOSSIER DE PRÉSENTATION DU SITE WEB",
        W / 2,
        H - 427,
        "Lato-Bold",
        8.2,
        GOLD_LIGHT,
        2.0,
        align="center",
    )

    # visuels
    iw, ih, gap = 176, 138, 12
    ix = W / 2 - (2 * iw + gap) / 2
    iy = 236
    for i, (src, center) in enumerate(
        (
            ("gateau-mariage-reference.jpg", (0.5, 0.55)),
            ("plats-africains-assortiment.jpg", (0.5, 0.5)),
        )
    ):
        x = ix + i * (iw + gap)
        c.setFillColor(HexColor("#4A1029"))
        c.roundRect(x - 4, iy - 4, iw + 8, ih + 8, 11, stroke=0, fill=1)
        c.setStrokeColor(HexColor("#8A6A46"))
        c.setLineWidth(0.6)
        c.roundRect(x - 4, iy - 4, iw + 8, ih + 8, 11, stroke=1, fill=0)
        place_image(c, ASSETS / src, x, iy, iw, ih, 8, center)

    # bandeau bas
    c.setFillColor(HexColor("#4C1129"))
    c.rect(33, 33, W - 66, 150, stroke=0, fill=1)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(W / 2 - 60, 164, W / 2 + 60, 164)

    spaced(
        c,
        "DALOA  ·  CÔTE D’IVOIRE",
        W / 2,
        143,
        "Lato-Bold",
        7.2,
        GOLD,
        2.0,
        align="center",
    )
    c.setFillColor(PAPER)
    c.setFont("Lato-Bold", 9.4)
    c.drawCentredString(W / 2, 116, f"{PHONE_1}   ·   {PHONE_2}")
    c.setFillColor(HexColor("#D9C3B2"))
    c.setFont("Lato", 8.2)
    c.drawCentredString(W / 2, 98, f"WhatsApp {WHATSAPP}   ·   {SITE_LABEL}")

    spaced(
        c,
        "OCTOBRE 2026",
        W / 2,
        58,
        "Lato-Bold",
        6.6,
        HexColor("#C9AE86"),
        1.8,
        align="center",
    )


def page_presentation(c):
    page_frame(c, 2)

    # filet décoratif
    c.setStrokeColor(HexColor("#E7DCC5"))
    c.setLineWidth(0.6)
    c.circle(W - 20, H - 30, 130, stroke=1, fill=0)

    y = section_head(
        c,
        "01   ·   PRÉSENTATION",
        [
            ("Votre savoir-faire,", S["h1"]),
            ("<font color='#762444'>enfin visible en ligne.</font>", S["h1"]),
        ],
        "Le site présente Les Délices de Kandys comme vous le faites en salle : avec "
        "générosité, soin et simplicité. Il rassemble vos prestations, vos réalisations "
        "et vos coordonnées, puis conduit chaque visiteur vers une commande WhatsApp.",
        width=455,
    )

    # --- colonne gauche
    left_x, left_w = M, 296
    y -= 30
    h = para(
        c,
        "Un site vitrine, pas une boutique en ligne.",
        left_x,
        y,
        left_w,
        st("x", "Playfair-Medium", 14.5, 17, WINE_DARK),
    )
    y -= h + 8
    h = para(
        c,
        "Aucune inscription, aucun paiement en ligne, aucune donnée client stockée : "
        "le visiteur découvre, choisit, puis vous écrit directement sur WhatsApp — "
        "comme un client qui pousse votre porte.",
        left_x,
        y,
        left_w,
        S["body"],
    )
    y -= h + 22

    points = [
        (
            "Mise en ligne immédiate",
            "Adresse courte et sécurisée (HTTPS), accessible 24 h/24 depuis un "
            "téléphone ou un ordinateur.",
        ),
        (
            "Pour vos clients",
            "Prestations, galerie photo des réalisations, coordonnées et accès direct "
            "à la commande.",
        ),
        (
            "Pour vous",
            "Un seul lien à partager sur WhatsApp, Facebook, Instagram ou votre fiche "
            "Google : votre vitrine reste à jour.",
        ),
        (
            "Sans abonnement mensuel",
            "Hébergement statique : rapide, stable, et sans coût de maintenance caché.",
        ),
    ]
    for title, desc in points:
        diamond(c, left_x + 3.2, y - 4.4, 2.0, GOLD)
        h = para(c, title, left_x + 14, y, left_w - 14, S["bullet_title"])
        y -= h + 2.5
        h = para(c, desc, left_x + 14, y, left_w - 14, S["bullet_desc"])
        y -= h + 14

    # --- fiche établissement (colonne droite)
    fx, fw = 372, W - M - 372
    fy = 300
    fh = 286
    shadow_card(c, fx, fy, fw, fh, PAPER, LINE, 12)
    c.setFillColor(WINE)
    c.roundRect(fx, fy + fh - 34, fw, 34, 12, stroke=0, fill=1)
    c.setFillColor(WINE)
    c.rect(fx, fy + fh - 34, fw, 12, stroke=0, fill=1)
    spaced(
        c,
        "FICHE ÉTABLISSEMENT",
        fx + 16,
        fy + fh - 22,
        "Lato-Bold",
        6.8,
        GOLD_LIGHT,
        1.5,
    )

    rows = [
        ("ACTIVITÉ", "Restaurant & pâtisserie"),
        ("ADRESSE", "Daloa, Côte d’Ivoire"),
        ("TÉLÉPHONE 1", PHONE_1),
        ("TÉLÉPHONE 2", PHONE_2),
        ("WHATSAPP", WHATSAPP),
        ("SITE WEB", SITE_LABEL),
        ("CLIENTÈLE", "Familles · entreprises · événements"),
        ("LANGUE", "Français"),
    ]
    ry = fy + fh - 52
    for i, (label, value) in enumerate(rows):
        spaced(c, label, fx + 16, ry, "Lato-Bold", 6.2, GOLD, 1.3)
        h = para(c, value, fx + 16, ry - 8, fw - 28, S["value"])
        ry -= 9 + h + 8
        if i < len(rows) - 1:
            c.setStrokeColor(HexColor("#EFE7D6"))
            c.setLineWidth(0.5)
            c.line(fx + 16, ry + 3, fx + fw - 16, ry + 3)

    # --- bandeau de chiffres clés
    stats = [
        ("24 h/24", "Le site répond même quand vous êtes en cuisine ou en salle."),
        ("1 clic", "Du site au message WhatsApp, sans compte à créer."),
        ("0 %", "Aucune commission prélevée sur les commandes reçues."),
    ]
    sx, sw = M, (W - 2 * M) / 3
    for i, (big, label) in enumerate(stats):
        x = sx + i * sw
        c.setStrokeColor(HexColor("#DCCFB4"))
        c.setLineWidth(0.6)
        c.line(x, 224, x + sw - 18, 224)
        c.setFillColor(WINE_DARK)
        c.setFont("Playfair-Medium", 20)
        c.drawString(x, 196, big)
        para(c, label, x, 186, sw - 20, S["small"])

    # --- sommaire
    sy = 108
    c.setStrokeColor(HexColor("#DCCFB4"))
    c.setLineWidth(0.6)
    c.line(M, sy + 40, W - M, sy + 40)
    spaced(c, "AU SOMMAIRE", M, sy + 24, "Lato-Bold", 6.4, GOLD, 1.6)

    items = [
        ("02", "Prestations"),
        ("03", "Réalisations"),
        ("04", "Le site web"),
        ("05", "QR code & suite"),
    ]
    x = M
    col = (W - 2 * M) / len(items)
    for num, label in items:
        c.setFillColor(GOLD)
        c.setFont("Playfair-MediumItalic", 10)
        c.drawString(x, sy + 2, num)
        c.setFillColor(INK)
        c.setFont("Lato-Bold", 7.8)
        c.drawString(x + 16, sy + 2, label)
        x += col


def page_prestations(c):
    page_frame(c, 3)

    y = section_head(
        c,
        "02   ·   NOS PRESTATIONS",
        [
            ("Six univers gourmands,", S["h1_center"]),
            ("<font color='#762444'>une seule adresse.</font>", S["h1_center"]),
        ],
        "Du déjeuner aux grandes célébrations : six univers clairs, organisés par envie, "
        "chacun avec un accès direct à la commande.",
        y=H - 78,
        center=True,
        width=390,
    )

    cards = [
        (
            "01",
            "Plats africains",
            "Attiéké, braisés, sauces et accompagnements généreux, préparés maison "
            "pour les repas à partager.",
        ),
        (
            "02",
            "Plats européens",
            "Recettes conviviales et bouchées salées, du déjeuner rapide au plateau "
            "à partager.",
        ),
        (
            "03",
            "Entrées",
            "Œufs mimosa, mini-pizzas, rouleaux croustillants : de quoi ouvrir "
            "l’appétit avec gourmandise.",
        ),
        (
            "04",
            "Jus",
            "Une note fraîche et fruitée, préparée sur place, pour accompagner "
            "chaque plat.",
        ),
        (
            "05",
            "Gâteaux de mariage",
            "Pièces montées sur mesure, décorées selon votre thème, pour le plus "
            "beau jour.",
        ),
        (
            "06",
            "Gâteaux d’anniversaire",
            "Créations personnalisées pour célébrer chaque âge, en famille ou entre "
            "amis.",
        ),
    ]

    cw, ch, gap = 237, 126, 16
    x0 = (W - (2 * cw + gap)) / 2
    y0 = 214
    for i, (num, title, desc) in enumerate(cards):
        col, row = i % 2, i // 2
        x = x0 + col * (cw + gap)
        y = y0 + (2 - row) * (ch + gap)
        shadow_card(c, x, y, cw, ch, PAPER, HexColor("#E6DCC8"), 11)
        c.setFillColor(HexColor("#F6F0E2"))
        c.circle(x + 30, y + ch - 30, 13, stroke=0, fill=1)
        c.setStrokeColor(GOLD_LIGHT)
        c.setLineWidth(0.6)
        c.circle(x + 30, y + ch - 30, 13, stroke=1, fill=0)
        c.setFillColor(WINE)
        c.setFont("Playfair-Medium", 10.5)
        c.drawCentredString(x + 30, y + ch - 33.6, num)

        h = para(c, title, x + 16, y + ch - 55, cw - 32, S["card_title"])
        para(c, desc, x + 16, y + ch - 55 - h - 7, cw - 32, S["card_desc"])

        # chiffre décoratif
        c.saveState()
        c.setFillColor(HexColor("#F2E8D4"))
        c.setFont("Playfair-Medium", 46)
        c.drawRightString(x + cw - 14, y + 10, num)
        c.restoreState()

    # pied de page : engagements
    py = 160
    pills = ["Fait maison", "Sur commande", "Personnalisable", "À Daloa"]
    labels = ["Sur place  ·  à emporter  ·  livraison sur demande"]
    TRACK = 1.2
    total = sum(
        pdfmetrics.stringWidth(p, "Lato-Bold", 6.9) + TRACK * (len(p) - 1) + 27 for p in pills
    ) + 7 * (len(pills) - 1)
    px = (W - total) / 2
    for p in pills:
        w = pdfmetrics.stringWidth(p, "Lato-Bold", 6.9) + TRACK * (len(p) - 1) + 27
        c.setFillColor(PAPER)
        c.setStrokeColor(HexColor("#D9C79E"))
        c.setLineWidth(0.6)
        c.roundRect(px, py, w, 21, 10.5, stroke=1, fill=1)
        spaced(c, p.upper(), px + 13.5, py + 7.5, "Lato-Bold", 6.9, WINE, TRACK)
        px += w + 7

    spaced(
        c,
        labels[0].upper(),
        W / 2,
        py - 16,
        "Lato-Bold",
        6.4,
        HexColor("#9A8B7C"),
        1.4,
        align="center",
    )


def page_realisations(c):
    page_frame(c, 4)
    # fond légèrement papier
    c.setFillColor(PAPER)
    c.rect(M - 10, 120, W - 2 * M + 20, H - 190, stroke=0, fill=0)

    y = section_head(
        c,
        "03   ·   NOS RÉALISATIONS",
        [
            ("Le goût se voit aussi.", S["h1"]),
        ],
        "Quatorze réalisations sont en ligne, classées par univers : cuisine africaine, "
        "cuisine européenne, entrées, pâtisserie, anniversaire et mariage. Le visiteur "
        "filtre, touche une photo et l’agrandit.",
        width=420,
    )

    shots = [
        ("plats-africains-assortiment.jpg", "Cuisine africaine", "Assiettes généreuses", (0.55, 0.5)),
        ("plat-africain-sauce.jpg", "Cuisine africaine", "Sauce & accompagnement", (0.5, 0.5)),
        ("mini-pizzas.jpg", "Cuisine européenne", "Bouchées façon pizza", (0.5, 0.5)),
        ("entree-oeufs-mimosa.jpg", "Entrées", "Œufs mimosa", (0.5, 0.55)),
        ("cakes-maison.jpg", "Pâtisserie", "Cakes & douceurs", (0.5, 0.5)),
        ("gateau-anniversaire-rose.jpg", "Anniversaire", "Gâteau d’anniversaire", (0.5, 0.5)),
        ("gateau-mariage-reference.jpg", "Mariage", "Pièce montée", (0.5, 0.52)),
        ("gateaux-boites-assorties.jpg", "Pâtisserie", "Boîtes assorties", (0.5, 0.5)),
    ]

    iw, ih, gx, gy = 232, 130, 18, 24
    x0 = (W - (2 * iw + gx)) / 2
    y_base = 158
    for i, (src, cat, title, center) in enumerate(shots[:6]):
        col, row = i % 2, i // 2
        x = x0 + col * (iw + gx)
        y = y_base + (2 - row) * (ih + gy + 20)
        place_image(c, ASSETS / src, x, y, iw, ih, 8, center)
        spaced(c, cat.upper(), x + 1, y - 12, "Lato-Bold", 5.9, GOLD, 1.3)
        para(c, title, x + 1, y - 16, iw, S["caption"])

    spaced(
        c,
        "EXTRAIT DE LA GALERIE  ·  14 PHOTOS DISPONIBLES SUR LE SITE",
        W / 2,
        104,
        "Lato-Bold",
        6.2,
        HexColor("#9A8B7C"),
        1.35,
        align="center",
    )


def page_site(c):
    page_frame(c, 5)

    y = section_head(
        c,
        "04   ·   LE SITE WEB",
        [
            ("Un parcours pensé", S["h1"]),
            ("<font color='#762444'>pour la commande.</font>", S["h1"]),
        ],
        "Chaque section répond à une question du client : que proposez-vous, à quoi "
        "cela ressemble, comment vous joindre et comment commander.",
        width=300,
    )

    # --- liste des fonctionnalités
    lx, lw = M, 264
    y -= 26
    features = [
        ("Un accueil qui donne envie", "Grands visuels, promesse claire, accès immédiat aux prestations et à l’appel."),
        ("Six prestations expliquées", "Un univers par carte : plats africains, européens, entrées, jus, mariages, anniversaires."),
        ("Une galerie filtrable", "Photos classées par catégorie ; agrandissement au toucher, légendes et compteurs."),
        ("Une page événements", "Un discours dédié aux mariages et anniversaires, avec appel à l’action."),
        ("Un formulaire sans compte", "Nom, prénoms, téléphone, localisation, catégorie et description de la commande."),
        ("WhatsApp en un clic", "Le message est rédigé automatiquement ; le client le relit puis l’envoie."),
        ("Contacts partout", "Deux numéros d’appel direct, WhatsApp prérempli et adresse à Daloa."),
        ("Lisible sur téléphone", "Mise en page responsive, menu adapté et images optimisées."),
    ]
    for title, desc in features:
        diamond(c, lx + 3.2, y - 4.2, 1.9, GOLD)
        h = para(c, title, lx + 14, y, lw - 14, S["bullet_title"])
        y -= h + 2
        h = para(c, desc, lx + 14, y, lw - 14, S["bullet_desc"])
        y -= h + 11

    # --- panneau commande
    px, pw = 330, W - M - 330
    py, ph = 120, 496
    c.setFillColor(WINE)
    c.roundRect(px, py, pw, ph, 12, stroke=0, fill=1)
    c.saveState()
    c.setStrokeAlpha(0.22)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.6)
    c.circle(px + pw + 20, py + ph - 20, 96, stroke=1, fill=0)
    c.restoreState()

    inner_x = px + 20
    inner_w = pw - 40
    ty = py + ph - 34
    spaced(c, "COMMANDER EN TROIS ÉTAPES", inner_x, ty, "Lato-Bold", 6.6, GOLD_LIGHT, 1.5)
    ty -= 30
    h = para(
        c,
        "Du premier message à la confirmation.",
        inner_x,
        ty,
        inner_w,
        st("z", "Playfair-Medium", 13.2, 15.6, PAPER),
    )
    ty -= h + 20

    steps = [
        ("01", "Vos coordonnées", "Nom, prénoms, téléphone et localisation."),
        ("02", "Son envie", "Gâteau, plat, entrée ou jus, avec le détail de la commande."),
        ("03", "WhatsApp s’ouvre", "Le message prérempli s’affiche : vous recevez la demande."),
    ]
    for num, title, desc in steps:
        c.setFillColor(HexColor("#7A2444"))
        c.circle(inner_x + 11, ty - 12, 11, stroke=0, fill=1)
        c.setStrokeColor(HexColor("#B08B5E"))
        c.setLineWidth(0.6)
        c.circle(inner_x + 11, ty - 12, 11, stroke=1, fill=0)
        spaced(c, num, inner_x + 11, ty - 15, "Playfair-Medium", 8, GOLD_LIGHT, 0, align="center")
        h = para(c, title, inner_x + 30, ty, inner_w - 30, S["card_title_light"])
        ty -= h + 3
        h = para(c, desc, inner_x + 30, ty, inner_w - 30, S["card_desc_light"])
        ty -= h + 20

    # mini-liste : ce que le client peut commander
    ty -= 2
    c.setStrokeColor(HexColor("#7A2444"))
    c.setLineWidth(0.5)
    c.line(inner_x, ty, inner_x + inner_w, ty)
    ty -= 16
    spaced(c, "CE QUE LE CLIENT PEUT DEMANDER", inner_x, ty, "Lato-Bold", 6.0, GOLD, 1.3)
    ty -= 15
    for item in (
        "Gâteaux d’anniversaire & de mariage",
        "Plats africains, plats européens",
        "Entrées, jus et plateaux à partager",
    ):
        diamond(c, inner_x + 3, ty + 2.6, 1.6, GOLD)
        h = para(c, item, inner_x + 12, ty, inner_w - 12, S["card_desc_light"])
        ty -= h + 7

    # encart
    box_h = 82
    c.setFillColor(HexColor("#4C1129"))
    c.roundRect(inner_x, py + 18, inner_w, box_h, 8, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#8A6A46"))
    c.setLineWidth(0.6)
    c.roundRect(inner_x, py + 18, inner_w, box_h, 8, stroke=1, fill=0)
    spaced(c, "CONFIDENTIALITÉ", inner_x + 13, py + 18 + box_h - 16, "Lato-Bold", 6.0, GOLD, 1.3)
    c.setStrokeColor(HexColor("#7A2444"))
    c.setLineWidth(0.5)
    c.line(inner_x + 13, py + 18 + box_h - 23, inner_x + inner_w - 13, py + 18 + box_h - 23)
    para(
        c,
        "Aucune donnée n’est stockée sur le site : tout passe par le message WhatsApp "
        "que le client choisit d’envoyer.",
        inner_x + 13,
        py + 18 + box_h - 30,
        inner_w - 26,
        st("c", "Lato", 7.2, 10.2, HexColor("#E4D2C6")),
    )

    # mention bas de page
    c.setStrokeColor(HexColor("#DCCFB4"))
    c.setLineWidth(0.6)
    c.line(M, 120, 316, 120)
    para(
        c,
        "Le site est un site vitrine : il ne gère ni paiement ni stock. Les commandes "
        "se finalisent par WhatsApp ou par téléphone, comme vous le faites aujourd’hui.",
        M,
        112,
        264,
        S["small"],
    )


def make_qr(path: Path, size_px=900):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=24,
        border=0,
    )
    qr.add_data(SITE_URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#570D2B", back_color="#FFFDF8").convert("RGB")
    img = img.resize((size_px, size_px), Image.NEAREST)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)
    return path


def page_qr(c):
    page_frame(c, 6)

    # --- en-tête
    eyebrow(c, "05   ·   ACCÈS DIRECT", M, 790)
    h1 = para(c, "Scannez,", M, 764, 300, S["h1"])
    h2 = para(
        c,
        "<font color='#762444'>le site s’ouvre.</font>",
        M,
        764 - h1 - 1,
        300,
        S["h1"],
    )
    para(
        c,
        "Ce code QR mène directement à la page d’accueil du site.",
        M,
        764 - h1 - h2 - 14,
        300,
        S["lead"],
    )

    # --- carte QR
    cx, cy, cw, ch = M, 286, 246, 360
    shadow_card(c, cx, cy, cw, ch, PAPER, HexColor("#E1D4BA"), 14)
    c.setStrokeColor(GOLD_LIGHT)
    c.setLineWidth(0.6)
    c.roundRect(cx + 10, cy + 10, cw - 20, ch - 20, 9, stroke=1, fill=0)

    spaced(
        c,
        "FLASHEZ  ·  PARTAGEZ",
        cx + cw / 2,
        cy + ch - 30,
        "Lato-Bold",
        6.6,
        WINE,
        1.8,
        align="center",
    )

    qpad = 26
    qs = cw - 2 * qpad
    qy = cy + 74
    c.setFillColor(PAPER)
    c.rect(cx + qpad, qy, qs, qs, stroke=0, fill=1)
    c.drawImage(
        str(make_qr(BUILD / "qr.png")),
        cx + qpad,
        qy,
        qs,
        qs,
        preserveAspectRatio=True,
        mask="auto",
    )
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.1)
    cl = 12
    for sx, sy, dx, dy in (
        (cx + qpad - 6, qy - 6, 1, 1),
        (cx + cw - qpad + 6, qy - 6, -1, 1),
        (cx + qpad - 6, qy + qs + 6, 1, -1),
        (cx + cw - qpad + 6, qy + qs + 6, -1, -1),
    ):
        c.line(sx, sy, sx + dx * cl, sy)
        c.line(sx, sy, sx, sy + dy * cl)

    c.setFillColor(WINE_DARK)
    c.setFont("Lato-Bold", 9.6)
    c.drawCentredString(cx + cw / 2, cy + 48, SITE_LABEL)
    gold_rule(c, cx + cw / 2, cy + 34, 46)

    # --- mode d'emploi
    rx = 330
    rw = W - M - rx
    spaced(c, "COMMENT LE SCANNER", rx, 640, "Lato-Bold", 6.6, WINE_SOFT, 1.6)
    ry = 618
    for num, title, desc in (
        ("01", "Ouvrez l’appareil photo", "Ou toute application de lecture de code QR."),
        ("02", "Cadrez le code", "À 20–30 cm, sans bouger, pendant deux secondes."),
        ("03", "Touchez la notification", "Le site s’ouvre : aucun téléchargement."),
    ):
        spaced(c, num, rx, ry, "Playfair-MediumItalic", 9.4, GOLD)
        hh = para(c, title, rx + 20, ry + 2, rw - 20, S["bullet_title"])
        hh2 = para(c, desc, rx + 20, ry + 2 - hh - 2, rw - 20, S["bullet_desc"])
        ry -= hh + hh2 + 15

    # --- contacts directs
    c.setStrokeColor(HexColor("#DCCFB4"))
    c.setLineWidth(0.6)
    c.line(rx, 452, W - M, 452)
    spaced(c, "SANS SCANNER  ·  APPELER OU ÉCRIRE", rx, 436, "Lato-Bold", 6.4, WINE_SOFT, 1.5)

    for i, (label, value) in enumerate(
        (
            ("TÉLÉPHONE 1", PHONE_1),
            ("TÉLÉPHONE 2", PHONE_2),
            ("WHATSAPP", WHATSAPP),
        )
    ):
        yy = 412 - i * 26
        spaced(c, label, rx, yy, "Lato-Bold", 5.9, GOLD, 1.2)
        c.setFillColor(INK)
        c.setFont("Lato-Bold", 8.6)
        c.drawString(rx, yy - 11, value)

    # --- pour aller plus loin
    sy = 208
    c.setStrokeColor(HexColor("#DCCFB4"))
    c.setLineWidth(0.6)
    c.line(M, sy + 52, W - M, sy + 52)
    spaced(c, "POUR ALLER PLUS LOIN", M, sy + 36, "Lato-Bold", 6.6, WINE_SOFT, 1.6)

    extra = [
        (
            "Un nom de domaine",
            "Ex. lesdelicesdekandys.ci : plus simple à dicter à la radio, à imprimer et à "
            "retenir pour vos clients.",
        ),
        (
            "Une fiche Google",
            "Horaires, photos et avis reliés au site pour être trouvé quand on cherche "
            "« pâtisserie Daloa ».",
        ),
        (
            "Des photos à jour",
            "Nouvelles créations ajoutées au fil des commandes, sans refonte ni "
            "interruption de service.",
        ),
    ]
    colw = (W - 2 * M) / 3
    for i, (title, desc) in enumerate(extra):
        x = M + i * colw
        diamond(c, x + 3, sy + 14, 2.0, GOLD)
        hh = para(c, title, x + 13, sy + 18, colw - 22, S["bullet_title"])
        para(c, desc, x + 13, sy + 18 - hh - 4, colw - 28, S["bullet_desc"])

    # --- bandeau final
    c.setFillColor(WINE_DARK)
    c.rect(0, 0, W, 92, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, 92, W, 1.2, stroke=0, fill=1)
    c.setFillColor(HexColor("#D9C3B2"))
    c.setFont("Playfair-Italic", 11)
    c.drawCentredString(W / 2, 60, "Merci de votre confiance.")
    spaced(
        c,
        "LE SITE EST EN LIGNE.  IL NE RESTE PLUS QU’À LE MONTRER.",
        W / 2,
        36,
        "Lato-Bold",
        7.2,
        GOLD_LIGHT,
        1.8,
        align="center",
    )


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Les Délices de Kandys — Dossier de présentation du site web")
    c.setAuthor("Les Délices de Kandys")
    c.setSubject("Prestations, informations pratiques et accès au site web par QR code")
    c.setKeywords("Les Délices de Kandys, Daloa, restaurant, pâtisserie, site web, QR code")
    c.setCreator("Dossier généré pour la présentation au propriétaire")

    builders = [
        ("cover", page_cover, "Couverture"),
        ("presentation", page_presentation, "Présentation de l’établissement"),
        ("prestations", page_prestations, "Nos prestations"),
        ("realisations", page_realisations, "Nos réalisations"),
        ("site", page_site, "Le site web"),
        ("qr", page_qr, "QR code & prochaines étapes"),
    ]
    for key, fn, title in builders:
        fn(c)
        c.bookmarkPage(key)
        c.addOutlineEntry(title, key, 0)
        c.showPage()

    c.save()
    size = OUT.stat().st_size / 1024
    print(f"OK → {OUT} ({size:.0f} Ko)")


if __name__ == "__main__":
    build()
