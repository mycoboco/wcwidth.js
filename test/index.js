/*
 *  test cases for wcwidth
 */

"use strict"

var wcwidth = require('../')
var test = require('tape')


test('handles regular strings', function (t) {
    t.strictEqual(wcwidth('abc'), 3)
    t.end()
})

test('handles wide strings', function (t) {
    t.strictEqual(wcwidth('한글字的模块テスト'), 18)
    t.end()
})

test('handles wide characters mixed with regular characters', function (t) {
    t.strictEqual(wcwidth('abc 한글字的模块テスト'), 22)
    t.end()
})

test('handles Hangul Jamos', function (t) {
    t.strictEqual(wcwidth('\u1100\u1175'), 2)          // 가
    t.strictEqual(wcwidth('\u1112\u1161\u11ab'), 2)    // 한
    t.strictEqual(wcwidth('\u1100\u1160\u11ab'), 2)    // JUNGSEONG FILLER
    t.strictEqual(wcwidth('\u115f\u1161'), 2)          // CHOSEONG FILLER
    t.strictEqual(wcwidth('\u115f\u11ab'), 2)          // CHOSEONG FILLER
    t.strictEqual(wcwidth('\u115f\u1160\u11ab'), 2)    // CHO/JUNGSEONG FILLER
    t.strictEqual(wcwidth('\u115f\u1161\u11ab'), 2)    // CHOSEONG FILLER
    t.strictEqual(wcwidth('\u1161'), 0)                // incomplete
    t.strictEqual(wcwidth('\u11ab'), 0)                // incomplete
    t.strictEqual(wcwidth('\u1161\u11ab'), 0)          // incomplete
    t.strictEqual(wcwidth('\u1160\u11ab'), 0)          // incomplete
    t.strictEqual(wcwidth('듀ᇰ'), 2)
    t.end()
})

test('handle surrogate pairs', function (t) {
    t.strictEqual(wcwidth('\ud835\udca5\ud835\udcc8'), 2)
    t.strictEqual(wcwidth('𝒥𝒶𝓋𝒶𝓈𝒸𝓇𝒾𝓅𝓉'), 10)
    t.strictEqual(wcwidth('\ud840\udc34\ud840\udd58'), 4)
    t.end()
})

test('invalid sequences with surrogate high/low values', function (t) {
    t.strictEqual(wcwidth('\ud835\u0065'), 2)
    t.strictEqual(wcwidth('\u0065\udcc8'), 2)
    t.strictEqual(wcwidth('a\ud835\u0065\u0065\udcc8z'), 6)
    t.end()
})

test('ignores control characters e.g. \\n', function (t) {
    t.strictEqual(wcwidth('abc\t한글字的模块テスト\ndef'), 24)
    t.end()
})

test('ignores bad input', function (t) {
    t.strictEqual(wcwidth(''), 0)
    t.strictEqual(wcwidth(3), 0)
    t.strictEqual(wcwidth({}), 0)
    t.strictEqual(wcwidth([]), 0)
    t.strictEqual(wcwidth(), 0)
    t.end()
})

test('ignores NUL', function (t) {
    t.strictEqual(wcwidth(String.fromCharCode(0)), 0)
    t.strictEqual(wcwidth('\0'), 0)
    t.end()
})

test('ignores NUL mixed with chars', function (t) {
    t.strictEqual(wcwidth('a' + String.fromCharCode(0) + '\n字的'), 5)
    t.strictEqual(wcwidth('a\0\n한글'), 5)
    t.end()
})

test('can have custom value for NUL', function (t) {
    t.strictEqual(wcwidth.config({
        nul: 10
    })(String.fromCharCode(0) + 'a字的'), 15)
    t.strictEqual(wcwidth.config({
        nul: 3
    })('\0' + 'a한글'), 8)
    t.end()
})

test('can have custom control char value', function (t) {
    t.strictEqual(wcwidth.config({
        control: 1
    })('abc\n한글字的模块テスト\ndef'), 26)
    t.end()
})

test('negative custom control chars == -1', function (t) {
    t.strictEqual(wcwidth.config({
        control: -1
    })('abc\n한글字的模块テスト\ndef'), -1)
    t.end()
})

test('negative custom value for NUL == -1', function (t) {
    t.strictEqual(wcwidth.config({
        nul: -1
    })('abc\n한글字的模块テスト\0def'), -1)
    t.end()
})

// end of test cases
