import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGreeting } from '../../src/greeting.js';

test('saúda pelo nome', () => {
  assert.equal(buildGreeting('Ana'), 'Olá, Ana!');
});

test('usa mundo por padrão', () => {
  assert.equal(buildGreeting(), 'Olá, mundo!');
});

test('usa mundo para nome vazio', () => {
  assert.equal(buildGreeting(''), 'Olá, mundo!');
});

test('usa mundo para espaços', () => {
  assert.equal(buildGreeting('   '), 'Olá, mundo!');
});

test('remove espaços ao redor do nome', () => {
  assert.equal(buildGreeting(' Ana '), 'Olá, Ana!');
});

test('converte valores numéricos em texto', () => {
  assert.equal(buildGreeting(123), 'Olá, 123!');
});

test('converte null explicitamente', () => {
  assert.equal(buildGreeting(null), 'Olá, null!');
});