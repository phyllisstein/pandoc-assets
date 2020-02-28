import enUS from 'hyphenopoly/patterns/en-us.wasm'
import path from 'path-browserify'

const wasmFile = path.basename(enUS, '.wasm')
const wasmPath = path.dirname(enUS)

window.Hyphenopoly = {
    fallbacks: {
        'en-us': wasmFile,
    },
    paths: {
        maindir: __webpack_public_path__,
        patterndir: `${ wasmPath }/`,
    },
    require: {
        'en-us': 'FORCEHYPHENOPOLY',
    },
    setup: {
        selectors: {
            '.markdown-body': {},
        },
    },
}

require('hyphenopoly/Hyphenopoly_Loader')
