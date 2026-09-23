"""Serve only Prompt Studio pages on 127.0.0.1, without CORS or uploads."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent
PORT = 8765
PAGES = {
    "/": "PromptStudio.html",
    "/PromptStudio.html": "PromptStudio.html",
    "/tools/H3Builder.html": "tools/H3Builder.html",
    "/tools/H3Studio.html": "tools/H3Studio.html",
    "/tools/WalkThrough.html": "tools/WalkThrough.html",
    "/tools/ClipPicker.html": "tools/ClipPicker.html",
    "/tools/ClipStitcher.html": "tools/ClipStitcher.html",
    "/tools/MetaInspector.html": "tools/MetaInspector.html",
    "/tools/video-prompt-translator.html": "tools/video-prompt-translator.html",
    "/tools/h3-studio-from-spec/H3Studio.html": "tools/h3-studio-from-spec/H3Studio.html",
    "/tools/h3-studio-review/H3Studio.html": "tools/h3-studio-review/H3Studio.html",
}
CSP = (
    "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "
    "img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; "
    "frame-src 'self'; frame-ancestors 'self'; connect-src http://localhost:11434 "
    "http://127.0.0.1:11434 http://127.0.0.1:8188; "
    "object-src 'none'; base-uri 'none'; form-action 'none'"
)


class Handler(BaseHTTPRequestHandler):
    server_version = "PromptStudio"
    sys_version = ""
    def do_GET(self):
        self._serve(False)

    def do_HEAD(self):
        self._serve(True)

    def _serve(self, head_only):
        if self.headers.get("Host") != f"127.0.0.1:{PORT}":
            self.send_error(400)
            return
        route = urlsplit(self.path).path
        if route == "/__health":
            body = str(ROOT).encode("utf-8")
            content_type = "text/plain; charset=utf-8"
        elif route in PAGES:
            path = ROOT / PAGES[route]
            if not path.is_file():
                self.send_error(404)
                return
            body = path.read_bytes()
            content_type = "text/html; charset=utf-8"
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Security-Policy", CSP)
        self.end_headers()
        if not head_only:
            self.wfile.write(body)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
