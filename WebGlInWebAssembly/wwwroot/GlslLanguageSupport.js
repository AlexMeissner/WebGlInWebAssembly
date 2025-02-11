﻿window.onload = function () {

    // language definition taken from https://github.com/patuwwy/WebGlInWebAssembly-Chrome-Plugin/issues/164

    require(["vs/editor/editor.main"], () => {
        monaco.languages.register({ id: 'glsl' });

        monaco.languages.setLanguageConfiguration('glsl', {
            wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\#\$\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
            comments: {
                lineComment: '//',
                blockComment: ['/*', '*/']
            },
            brackets: [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ],
            autoClosingPairs: [
                { open: '[', close: ']' },
                { open: '{', close: '}' },
                { open: '(', close: ')' },
                { open: "'", close: "'", notIn: ['string', 'comment'] },
                { open: '"', close: '"', notIn: ['string'] }
            ]
        });

        monaco.languages.setMonarchTokensProvider('glsl', {
            defaultToken: '',
            tokenPostfix: '.glsl',
            types: ['bool', 'bvec2', 'bvec3', 'bvec4', 'float', 'int', 'ivec2', 'ivec3', 'ivec4', 'mat2', 'mat2x2', 'mat2x3', 'mat2x4', 'mat3', 'mat3x2', 'mat3x3', 'mat3x4', 'mat4', 'mat4x2', 'mat4x3', 'mat4x4', 'uint', 'uvec2', 'uvec3', 'uvec4', 'vec2', 'vec3', 'vec4', 'void'],
            keywords: ['attribute', 'break', 'case', 'centroid', 'const', 'continue', 'default', 'discard', 'do', 'else', 'false', 'flat', 'for', 'highp', 'if', 'in', 'inout', 'invariant', 'isampler2D', 'isampler2DArray', 'isampler3D', 'isamplerCube', 'layout', 'lowp', 'mediump', 'out', 'precision', 'return', 'sampler2D', 'sampler2DArray', 'sampler2DArrayShadow', 'sampler2DShadow', 'sampler3D', 'samplerCube', 'samplerCubeShadow', 'smooth', 'struct', 'switch', 'true', 'uniform', 'usampler2D', 'usampler2DArray', 'usampler3D', 'usamplerCube', 'varying', 'while'],
            functions: ['radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt', 'abs', 'sign', 'floor', 'trunc', 'round', 'roundEven', 'ceil', 'fract', 'mod', 'modf', 'min', 'max', 'clamp', 'mix', 'step', 'smoothstep', 'isnan', 'isinf', 'floatBitsToInt', 'floatBitsToUint', 'intBitsToFloat', 'uintBitsToFloat', 'packSnorm2x16', 'unpackSnorm2x16', 'packUnorm2x16', 'unpackUnorm2x16', 'packHalf2x16', 'unpackHalf2x16', 'length', 'distance', 'dot', 'cross', 'normalize', 'faceforward', 'reflect', 'refract', 'matrixCompMult', 'outerProduct', 'transpose', 'determinant', 'inverse', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'equal', 'notEqual', 'any', 'all', 'not', 'textureSize', 'texture', 'texture2D', 'textureCube', 'texture2DProj', 'texture2DLodEXT', 'texture2DProjLodEXT', 'textureCubeLodEXT', 'texture2DGradEXT', 'texture2DProjGradEXT', 'textureCubeGradEXT', 'textureProj', 'textureLod', 'textureOffset', 'texelFetch', 'texelFetchOffset', 'textureProjOffset', 'textureLodOffset', 'textureProjLod', 'textureProjLodOffset', 'textureGrad', 'textureGradOffset', 'textureProjGrad', 'textureProjGradOffset', 'dFdx', 'dFdy', 'fwidth'],
            operators: ['++', '--', '+', '-', '~', '!', '*', '/', '%', '<<', '>>', '<', '>', '<=', '>=', '==', '!=', '&', '^', '|', '&&', '^^', '||', '?', ':', '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '^=', '|=', ','],
            brackets: [
                { token: 'delimiter.curly', open: '{', close: '}' },
                { token: 'delimiter.parenthesis', open: '(', close: ')' },
                { token: 'delimiter.square', open: '[', close: ']' },
                { token: 'delimiter.angle', open: '<', close: '>' }
            ],
            symbols: /[=><!~?:&|+\-*\/\^%]+/,
            integersuffix: /[uU]?/,
            floatsuffix: /[fF]?/,
            func: /[a-zA-Z_0-9]+/,
            tokenizer: {
                root: [
                    [/\d*\d+[eE]([\-+]?\d+)?(@floatsuffix)/, 'number.float'],
                    [/\d*\.\d+([eE][\-+]?\d+)?(@floatsuffix)/, 'number.float'],
                    [/0[xX][0-9a-fA-F']*[0-9a-fA-F](@integersuffix)/, 'number.hex'],
                    [/([+-]?)\d+(@integersuffix)/, 'number.integer'],
                    [/#(version|define|undef|ifdef|ifndef|else|elsif|endif)/, 'keyword.directive'],
                    [/\$[a-zA-Z0-9]*/, 'regexp'],
                    [/\s[A-Z_][A-Z_0-9]*/, 'constant'],
                    [/gl_[a-zA-Z_0-9]+/, 'keyword.gl'],
                    [
                        /([a-zA-Z_][a-zA-Z_0-9]*)/,
                        {
                            cases: {
                                '@types': { token: 'keyword.$0' },
                                '@keywords': { token: 'keyword.$0' },
                                '@functions': { token: 'keyword.builtins.$0' },
                                '@default': 'identifier'
                            }
                        }
                    ],
                    [/(\d+(\.\d+))/, 'number.float'],
                    [/\d+/, 'keyword'],
                    [/\/\/.+/, 'comment'],
                    [/\/\*.+?(\*\/)/, 'comment'],
                    [/[{}()\[\]]/, '@brackets'],
                    [
                        /@symbols/,
                        {
                            cases: {
                                '@operators': 'delimiter',
                                '@default': ''
                            }
                        }
                    ],
                    [/[;,.]/, 'delimiter'],
                ],
            }
        });
    });
}
