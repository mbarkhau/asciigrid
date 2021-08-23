import functools
import urllib.parse

import flask

from markdown_svgbob.wrapper import text2svg
from markdown_svgbob.extension import svg2html

app = flask.Flask(__name__)

text2svg_cached = functools.lru_cache(maxsize=1000)(text2svg)


@app.route("/bob2svg", methods=['GET', 'POST', 'OPTIONS'])
def bob2svg():
    headers = {
        'Access-Control-Allow-Methods': "GET, POST, OPTIONS",
        'Access-Control-Max-Age': 86400,
    }

    if flask.request.headers.get('Origin') == "http://localhost:8000":
        origin = "http://localhost:8000"
    else:
        origin = "https://mbarkhau.keybase.pub"

    headers['Access-Control-Allow-Origin'] = origin
    if flask.request.method == 'OPTIONS':
        return flask.Response("", headers=headers)

    if flask.request.method == 'POST':
        bob_data = flask.request.data
        if len(bob_data) > 1024 * 100:
            return flask.Response("Request too large", 400)
        bob_text = bob_data.decode('utf-8')
    else:
        bob_quoted = flask.request.args.get('d')
        if bob_quoted is None:
            return flask.Response("Missing parameter: ?d=<quoted_diagram_text>", 400)
        bob_text = urllib.parse.unquote(bob_quoted)

    svg_data = text2svg_cached(bob_text)

    if flask.request.args.get('fmt') == 'img_base64_svg':
        img_data = svg2html(svg_data, tag_type='img_base64_svg')
        headers['Content-Type'] = "image/svg+xml;base64"
        return flask.Response(img_data, headers=headers)

    headers['Content-Disposition'] = 'attachment; filename="diagram.svg"'
    headers['Content-Type'] = "image/svg+utf-8"
    return flask.Response(svg_data, headers=headers)


@app.route('/')
def hello_world():
    header_str = str(flask.request.headers)
    return flask.Response(
        header_str,
        headers={
            'Content-Type': "text/plain"
        }
    )

