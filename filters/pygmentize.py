#!/usr/local/bin/python2

from __future__ import print_function
from pygments import highlight
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.formatters import HtmlFormatter
from pandocfilters import toJSONFilter, RawBlock


def pygmentize(key, value, format, meta):
    def fallback():
        html = '<pre><code>' + value[1] + '</code></pre>'
        return RawBlock('html', html)

    if key == 'CodeBlock':
        if len(value[0]) >= 2:
            try:
                lang = value[0][1][0]
            except IndexError:
                return fallback()
        else:
            return fallback()

        lexer = None

        try:
            lexer = get_lexer_by_name(lang, encoding='utf-8')
        except:
            pass

        try:
            lexer = guess_lexer(value[1], encoding='utf-8')
        except:
            pass

        if not lexer:
            return fallback()

        formatter = HtmlFormatter(style='colorful', encoding='utf-8')
        highlit = highlight(value[1], lexer, formatter)
        return RawBlock('html', highlit)

if __name__ == '__main__':
    toJSONFilter(pygmentize)
