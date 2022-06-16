import {
  initialLineState,
  tokenizeLine,
  TokenType,
  TokenMap,
} from '../src/tokenizeJavaScript.js'

const DEBUG = true

const expectTokenize = (text, state = initialLineState.state) => {
  const lineState = {
    state,
  }
  const tokens = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const result = tokenizeLine(lines[i], lineState)
    lineState.state = result.state
    tokens.push(...result.tokens.map((token) => token.type))
    tokens.push(TokenType.NewLine)
  }
  tokens.pop()
  return {
    toEqual(...expectedTokens) {
      if (DEBUG) {
        expect(tokens.map((token) => TokenMap[token])).toEqual(
          expectedTokens.map((token) => TokenMap[token])
        )
      } else {
        expect(tokens).toEqual(expectedTokens)
      }
    },
  }
}

test('empty', () => {
  expectTokenize(``).toEqual()
})

test('whitespace', () => {
  expectTokenize(' ').toEqual(TokenType.Whitespace)
})

test('keyword', () => {
  // see https://www.programiz.com/javascript/keywords-identifiers
  expectTokenize('as').toEqual(TokenType.KeywordControl)
  expectTokenize('async').toEqual(TokenType.KeywordModifier)
  expectTokenize('await').toEqual(TokenType.KeywordModifier)
  expectTokenize('break').toEqual(TokenType.KeywordControl)
  expectTokenize('case').toEqual(TokenType.KeywordControl)
  expectTokenize('catch').toEqual(TokenType.Keyword)
  expectTokenize('class').toEqual(TokenType.Keyword)
  expectTokenize('const').toEqual(TokenType.Keyword)
  expectTokenize('continue').toEqual(TokenType.Keyword)
  expectTokenize('debugger').toEqual(TokenType.Keyword)
  expectTokenize('default').toEqual(TokenType.KeywordControl)
  expectTokenize('delete').toEqual(TokenType.Keyword)
  expectTokenize('do').toEqual(TokenType.Keyword)
  expectTokenize('else').toEqual(TokenType.KeywordControl)
  expectTokenize('enum').toEqual(TokenType.Keyword)
  expectTokenize('export').toEqual(TokenType.KeywordImport)
  expectTokenize('extends').toEqual(TokenType.Keyword)
  expectTokenize('false').toEqual(TokenType.LanguageConstant)
  expectTokenize('finally').toEqual(TokenType.Keyword)
  expectTokenize('for').toEqual(TokenType.Keyword)
  expectTokenize('from').toEqual(TokenType.KeywordImport)
  expectTokenize('function').toEqual(TokenType.Keyword)
  expectTokenize('if').toEqual(TokenType.KeywordControl)
  expectTokenize('implements').toEqual(TokenType.Keyword)
  expectTokenize('import').toEqual(TokenType.KeywordImport)
  expectTokenize('in').toEqual(TokenType.Keyword)
  expectTokenize('instanceof').toEqual(TokenType.Keyword)
  expectTokenize('interface').toEqual(TokenType.Keyword)
  expectTokenize('let').toEqual(TokenType.Keyword)
  expectTokenize('new').toEqual(TokenType.KeywordNew)
  expectTokenize('null').toEqual(TokenType.LanguageConstant)
  expectTokenize('package').toEqual(TokenType.Keyword)
  expectTokenize('private').toEqual(TokenType.Keyword)
  expectTokenize('protected').toEqual(TokenType.Keyword)
  expectTokenize('public').toEqual(TokenType.Keyword)
  expectTokenize('return').toEqual(TokenType.KeywordReturn)
  expectTokenize('super').toEqual(TokenType.Keyword)
  expectTokenize('switch').toEqual(TokenType.KeywordControl)
  expectTokenize('static').toEqual(TokenType.Keyword)
  expectTokenize('this').toEqual(TokenType.Keyword)
  expectTokenize('throw').toEqual(TokenType.KeywordControl)
  expectTokenize('try').toEqual(TokenType.Keyword)
  expectTokenize('true').toEqual(TokenType.LanguageConstant)
  expectTokenize('typeof').toEqual(TokenType.Keyword)
  expectTokenize('var').toEqual(TokenType.Keyword)
  expectTokenize('void').toEqual(TokenType.Keyword)
  expectTokenize('while').toEqual(TokenType.Keyword)
  expectTokenize('with').toEqual(TokenType.Keyword)
  expectTokenize('yield').toEqual(TokenType.Keyword)
})

test('decimal number', () => {
  expectTokenize(`x=1`).toEqual(
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Numeric
  )
})

test('line comment', () => {
  expectTokenize('// test comment').toEqual(
    TokenType.Comment,
    TokenType.Comment
  )
})

test('block comment', () => {
  expectTokenize('/* block comment */ abc').toEqual(
    TokenType.Comment,
    TokenType.Comment,
    TokenType.Comment,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('block comment - confusion with regex', () => {
  expectTokenize('/* eslint-disable */').toEqual(
    TokenType.Comment,
    TokenType.Comment,
    TokenType.Comment
  )
})

test('single quoted string', () => {
  expectTokenize(`'Hello' abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('double quoted string', () => {
  expectTokenize(`"Hello" abc`).toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.VariableName
  )
})

test('semicolon', () => {
  expectTokenize(`;`).toEqual(TokenType.Punctuation)
})

test('opening curly brace', () => {
  expectTokenize(`{`).toEqual(TokenType.Punctuation)
})

test('closing curly brace', () => {
  expectTokenize(`}`).toEqual(TokenType.Punctuation)
})

test('opening square brace', () => {
  expectTokenize(`[`).toEqual(TokenType.Punctuation)
})

test('closing square brace', () => {
  expectTokenize(`]`).toEqual(TokenType.Punctuation)
})

test('comma', () => {
  expectTokenize(`,`).toEqual(TokenType.Punctuation)
})

test('strict equal', () => {
  expectTokenize(`===`).toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('strict not equal', () => {
  expectTokenize(`!==`).toEqual(
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('function', () => {
  expectTokenize(`function setupCurrentWorkingDirectory() {}`).toEqual(
    TokenType.Keyword,
    TokenType.Whitespace,
    TokenType.VariableName,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('variable with underscore', () => {
  expectTokenize('__dirname').toEqual(TokenType.VariableName)
})

test('while loop', () => {
  expectTokenize('while(x < 10) {}').toEqual(
    TokenType.Keyword,
    TokenType.Punctuation,
    TokenType.VariableName,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation
  )
})

test('and', () => {
  expectTokenize('1 && 2').toEqual(
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('or', () => {
  expectTokenize('1 || 2').toEqual(
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('bitwise xor', () => {
  expectTokenize('1 ^ 2').toEqual(
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

// TODO test regex with escapes
test('regex', () => {
  expectTokenize(
    `/^((?!(googleapis|analytics|googleusercontent)).)*$/`
  ).toEqual(TokenType.Regex)
})

test('ternary', () => {
  expectTokenize('1 ? 2 : 3').toEqual(
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric,
    TokenType.Whitespace,
    TokenType.Punctuation,
    TokenType.Whitespace,
    TokenType.Numeric
  )
})

test('star', () => {
  expectTokenize('*').toEqual(TokenType.Punctuation)
})

test('backtick string - empty', () => {
  expectTokenize('``').toEqual(TokenType.Punctuation, TokenType.Punctuation)
})

test('backtick string - with text', () => {
  expectTokenize('`abc`').toEqual(
    TokenType.Punctuation,
    TokenType.String,
    TokenType.Punctuation
  )
})
