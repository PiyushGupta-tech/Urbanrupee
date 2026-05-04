#!/usr/bin/env python3
"""One-off: add CRUSH-style footer brand column + ur-footer-crush layout to all Urbanrupee/*.html."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "Urbanrupee"

ROW_OLD = '<div class="row justify-content-center text-center">'
ROW_NEW = (
    '<div class="row ur-footer-crush__row row-cols-1 gy-4 align-items-start '
    'justify-content-lg-between justify-content-center text-lg-start text-center">'
)

BRAND = """          <div class="col-12 col-lg-3 mb-4 mb-lg-0 ur-footer-crush__brand">
            <a class="ur-footer-crush__logo-link" href="/"
              ><img
                class="ur-footer-crush__logo-img"
                src="assets/images/logo/logo.png"
                alt="Urbanrupee"
                width="200"
                height="60"
                decoding="async"
                loading="lazy"
            /></a>
            <p class="ur-footer-crush__tagline">Enterprise payment infrastructure for modern businesses.</p>
            <nav class="ur-footer-crush__social" aria-label="Urbanrupee on social media">
              <ul>
                <li>
                  <a href="https://www.instagram.com/urbanrupee_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    ><i class="fa-brands fa-lg fa-instagram" aria-hidden="true"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/urbanrupeex/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    ><i class="fa-brands fa-lg fa-linkedin-in" aria-hidden="true"></i
                  ></a>
                </li>
                <li>
                  <a href="https://x.com/urbanrupee" target="_blank" rel="noopener noreferrer" aria-label="X"
                    ><i class="fa-brands fa-lg fa-twitter" aria-hidden="true"></i
                  ></a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@urbanrupee.1" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                    ><i class="fa-brands fa-lg fa-youtube" aria-hidden="true"></i
                  ></a>
                </li>
              </ul>
            </nav>
          </div>
"""

SOCIAL_BLOCK = re.compile(
    r"\s*<!--\s*Social Media Icons\s*-->\s*<div class=\"footer__social[^>]*>.*?</ul>\s*</div>",
    re.DOTALL,
)


def transform(html: str) -> tuple[str, bool]:
    if "ur-footer-crush__brand" in html:
        return html, False

    if '<div class="footer__menu">' not in html:
        return html, False

    out = html.replace('<div class="footer__menu">', '<div class="footer__menu ur-footer-crush">', 1)
    if ROW_OLD not in out:
        return html, False

    out = out.replace(ROW_OLD, ROW_NEW, 1)
    out = out.replace(ROW_NEW, ROW_NEW + "\n" + BRAND, 1)

    start = out.find('<div class="footer__menu ur-footer-crush">')
    end = out.find('<div class="footer__bottombar">', start)
    if start == -1 or end == -1:
        return html, False

    segment = out[start:end]
    segment = segment.replace("col-12 col-sm-6 col-lg-4 mb-3", "col-12 col-sm-6 col-lg-3 mb-3")
    out = out[:start] + segment + out[end:]

    new_out, n = SOCIAL_BLOCK.subn("", out, count=1)
    if n:
        out = new_out

    return out, True


def main() -> int:
    changed = 0
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        new_text, did = transform(text)
        if did:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
            print("updated", path.name)
    print("total", changed, "files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
