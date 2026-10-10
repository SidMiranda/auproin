import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://auproin.com.br"
OLD_URL = "sidmiranda.github.io/auproin"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = set()
        self.json_ld = []
        self._json_buffer = None

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        self.tags.append((tag, data))
        if data.get("id"):
            self.ids.add(data["id"])
        if tag == "script" and data.get("type") == "application/ld+json":
            self._json_buffer = []

    def handle_endtag(self, tag):
        if tag == "script" and self._json_buffer is not None:
            self.json_ld.append("".join(self._json_buffer))
            self._json_buffer = None

    def handle_data(self, data):
        if self._json_buffer is not None:
            self._json_buffer.append(data)


def html_files():
    return sorted(ROOT.glob("**/*.html"))


def parse_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def public_path(path):
    relative = path.relative_to(ROOT).as_posix()
    if relative == "index.html":
        return "/"
    if relative.endswith("/index.html"):
        return "/" + relative.removesuffix("index.html")
    return "/" + relative


def local_target(url):
    parsed = urlparse(url)
    path = unquote(parsed.path).lstrip("/")
    target = ROOT / path
    if not path or parsed.path.endswith("/"):
        target /= "index.html"
    return target, parsed.fragment


class SiteTests(unittest.TestCase):
    def test_expected_pages_and_unique_metadata(self):
        pages = [path for path in html_files() if path.name == "index.html"]
        self.assertEqual(14, len(pages))
        titles = set()
        canonicals = set()
        for path in pages:
            with self.subTest(page=path.relative_to(ROOT)):
                parser = parse_page(path)
                self.assertEqual(1, sum(tag == "h1" for tag, _ in parser.tags))
                title = re.search(r"<title>(.*?)</title>", path.read_text(encoding="utf-8"), re.S)
                self.assertIsNotNone(title)
                self.assertNotIn(title.group(1), titles)
                titles.add(title.group(1))
                descriptions = [attrs.get("content") for tag, attrs in parser.tags if tag == "meta" and attrs.get("name") == "description"]
                self.assertEqual(1, len(descriptions))
                self.assertGreaterEqual(len(descriptions[0]), 80)
                canonical = [attrs.get("href") for tag, attrs in parser.tags if tag == "link" and attrs.get("rel") == "canonical"]
                self.assertEqual(1, len(canonical))
                self.assertTrue(canonical[0].startswith(DOMAIN + "/"))
                self.assertNotIn(canonical[0], canonicals)
                canonicals.add(canonical[0])

    def test_json_ld_is_valid(self):
        for path in html_files():
            if path.name != "index.html":
                continue
            with self.subTest(page=path.relative_to(ROOT)):
                parser = parse_page(path)
                for block in parser.json_ld:
                    data = json.loads(block)
                    self.assertEqual("https://schema.org", data.get("@context"))

    def test_images_have_dimensions_alt_and_existing_files(self):
        for path in html_files():
            parser = parse_page(path)
            page_url = DOMAIN + public_path(path)
            for tag, attrs in parser.tags:
                if tag != "img":
                    continue
                with self.subTest(page=path.relative_to(ROOT), src=attrs.get("src")):
                    self.assertIn("alt", attrs)
                    self.assertIn("width", attrs)
                    self.assertIn("height", attrs)
                    target, _ = local_target(urljoin(page_url, attrs["src"]))
                    self.assertTrue(target.is_file(), f"Imagem ausente: {target}")

    def test_internal_links_and_fragments_exist(self):
        for path in html_files():
            parser = parse_page(path)
            page_url = DOMAIN + public_path(path)
            for tag, attrs in parser.tags:
                attr = "href" if tag in {"a", "link"} else "src" if tag == "script" else None
                if not attr or not attrs.get(attr):
                    continue
                raw = attrs[attr]
                parsed_raw = urlparse(raw)
                if parsed_raw.scheme in {"mailto", "tel", "data", "javascript"}:
                    continue
                absolute = urljoin(page_url, raw)
                parsed = urlparse(absolute)
                if parsed.netloc != "auproin.com.br":
                    continue
                target, fragment = local_target(absolute)
                with self.subTest(page=path.relative_to(ROOT), target=raw):
                    self.assertTrue(target.is_file(), f"Link local ausente: {target}")
                    if fragment and target.suffix == ".html":
                        self.assertIn(fragment, parse_page(target).ids)

    def test_sitemap_matches_indexable_pages(self):
        tree = ElementTree.parse(ROOT / "sitemap.xml")
        namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [node.text for node in tree.findall("s:url/s:loc", namespace)]
        lastmods = [node.text for node in tree.findall("s:url/s:lastmod", namespace)]
        self.assertEqual(13, len(urls))
        self.assertEqual(len(urls), len(set(urls)))
        self.assertNotIn(DOMAIN + "/parceiros/", urls)
        self.assertTrue(all(url.startswith(DOMAIN + "/") for url in urls))
        self.assertEqual({"2026-10-10"}, set(lastmods))
        for url in urls:
            target, _ = local_target(url)
            self.assertTrue(target.is_file())

    def test_crawler_policy_separates_search_from_training(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        self.assertIn("User-agent: OAI-SearchBot\nAllow: /", robots)
        self.assertIn("User-agent: PerplexityBot\nAllow: /", robots)
        self.assertIn("User-agent: GPTBot\nDisallow: /", robots)
        self.assertIn("User-agent: ClaudeBot\nDisallow: /", robots)
        self.assertIn("User-agent: Google-Extended\nDisallow: /", robots)
        self.assertIn("Disallow: /parceiros/", robots)
        self.assertIn(f"Sitemap: {DOMAIN}/sitemap.xml", robots)

    def test_private_partner_page_and_error_page_are_not_indexed(self):
        partners = (ROOT / "parceiros" / "index.html").read_text(encoding="utf-8")
        error = (ROOT / "404.html").read_text(encoding="utf-8")
        self.assertIn('name="robots" content="noindex, follow"', partners)
        self.assertIn('name="robots" content="noindex"', error)

    def test_contact_is_direct_and_instrumented(self):
        contact = (ROOT / "contato" / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("<form", contact)
        self.assertIn("mailto:paulo.souza@auproin.com.br?subject=", contact)
        self.assertIn("tel:+5515988016442", contact)
        self.assertIn('data-event="contato_whatsapp"', contact)
        self.assertIn('data-event="contato_email"', contact)
        self.assertIn('data-event="contato_telefone"', contact)

    def test_domain_and_discovery_files(self):
        self.assertEqual("auproin.com.br", (ROOT / "CNAME").read_text(encoding="utf-8").strip())
        for relative in ["llms.txt", "llms-full.txt", "robots.txt", "sitemap.xml"]:
            content = (ROOT / relative).read_text(encoding="utf-8")
            self.assertNotIn(OLD_URL, content, relative)
        for path in [ROOT / "src" / "content.mjs", ROOT / "README.md", *html_files()]:
            self.assertNotIn(OLD_URL, path.read_text(encoding="utf-8"), str(path))

    def test_fonts_are_local_and_licensed(self):
        css = (ROOT / "assets" / "css" / "site.css").read_text(encoding="utf-8")
        self.assertNotIn("fonts.googleapis.com", css)
        self.assertNotIn("fonts.gstatic.com", css)
        for name in [
            "barlow-400.woff2", "barlow-500.woff2", "barlow-600.woff2",
            "barlow-condensed-400.woff2", "barlow-condensed-600.woff2",
        ]:
            self.assertTrue((ROOT / "assets" / "fonts" / name).is_file())
        self.assertTrue((ROOT / "assets" / "fonts" / "OFL.txt").is_file())
        for path in html_files():
            self.assertNotIn("fonts.googleapis.com", path.read_text(encoding="utf-8"))

    def test_no_accidental_secret_or_orphan_requirements_page(self):
        self.assertFalse((ROOT / "requisitos.html").exists())
        example = (ROOT / ".env.example").read_text(encoding="utf-8")
        assignment = re.search(r"^GEMINI_API_KEY=(.*)$", example, re.MULTILINE)
        self.assertIsNotNone(assignment)
        self.assertEqual("", assignment.group(1).strip())


if __name__ == "__main__":
    unittest.main()
