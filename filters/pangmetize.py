#!/usr/bin/env python3

from panflute import *
from jsx import JsxLexer
from pygments import highlight
from pygments.lexers import (
    get_lexer_by_name,
    guess_lexer,
)
from pygments.formatters import HtmlFormatter


def pygmentize_code_blocks(elem, doc):
    if not isinstance(elem, CodeBlock):
        return None

    lang = elem.attributes.get('lang', None)
    if lang is None:
        return None

    lexer = None

    if lang in ("typescript", "typescriptreact", "javascript", "javascriptreact", "jsx",):
        lexer = JsxLexer()
    else:
        try:
            lexer = get_lexer_by_name(lang, encoding='utf-8')
        except:
            pass

        try:
            lexer = guess_lexer(elem.text, encoding='utf-8')
        except:
            pass

    if not lexer:
        return None

    style = elem.attributes.get()
    formatter = HtmlFormatter()



def main(doc=None):
    return run_filter(pygmentize_code_blocks, doc=doc)


if __name__ == "__main__":
    main()
