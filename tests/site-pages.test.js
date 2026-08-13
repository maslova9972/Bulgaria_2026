import assert from 'node:assert/strict'
import test from 'node:test'
import { sitePageUrl } from '../src/sitePages.js'

test('cross-page links stay beside the current entry file', () => {
  assert.equal(sitePageUrl('breakfast.html', '/'), '/breakfast.html')
  assert.equal(sitePageUrl('breakfast.html', '/index.html'), '/breakfast.html')
  assert.equal(sitePageUrl('breakfast.html', '/index.html/'), '/breakfast.html')
  assert.equal(sitePageUrl('index.html', '/breakfast.html'), '/index.html')
})

test('cross-page links preserve a GitHub Pages repository path', () => {
  assert.equal(sitePageUrl('breakfast.html', '/Bulgaria_2026/'), '/Bulgaria_2026/breakfast.html')
  assert.equal(sitePageUrl('breakfast.html', '/Bulgaria_2026/index.html/'), '/Bulgaria_2026/breakfast.html')
  assert.equal(sitePageUrl('index.html', '/Bulgaria_2026/breakfast.html'), '/Bulgaria_2026/index.html')
})

test('a previously broken nested entry URL recovers to the site directory', () => {
  assert.equal(sitePageUrl('breakfast.html', '/index.html/breakfast.html'), '/breakfast.html')
  assert.equal(
    sitePageUrl('breakfast.html', '/Bulgaria_2026/index.html/breakfast.html'),
    '/Bulgaria_2026/breakfast.html',
  )
})
