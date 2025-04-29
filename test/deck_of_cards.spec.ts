import { spec } from 'pactum';

const BASE_URL = 'https://deckofcardsapi.com/api/deck';

describe('Deck of Cards', () => {
  let deckId: string;

  test('Criar um novo baralho sem embaralhar', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/new/`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.shuffled).toBe(false);
    expect(reset.remaining).toBe(52);
    expect(reset.deck_id).toBeDefined();

    deckId = reset.deck_id;
  });

  test.skip('Criar um novo baralho embaralhado', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/new/shuffle/`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.shuffled).toBe(true);
    expect(reset.remaining).toBe(52);
    expect(reset.deck_id).toBeDefined();
  });

  test('Comprar uma carta de um baralho existente', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/${deckId}/draw/?count=1`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.cards.length).toBe(1);
    expect(reset.remaining).toBe(51);
  });

  test.skip('Comprar várias cartas de um baralho existente', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/${deckId}/draw/?count=5`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.cards.length).toBe(5);
    expect(reset.remaining).toBe(46);
  });

  test('Comprar mais cartas do que o disponível no baralho', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/${deckId}/draw/?count=60`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.cards.length).toBeLessThanOrEqual(46);
    expect(reset.remaining).toBe(0);
  });

  test('Criar um baralho com cartas específicas', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/new/?cards=AS,2S,KS,AD,2D`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.remaining).toBe(5);
    expect(reset.deck_id).toBeDefined();
  });

  test.skip('Verificar o número de cartas restantes após compras', async () => {
    const novoDeck = await spec()
      .get(`${BASE_URL}/new/`)
      .expectStatus(200)
      .returns('body');

    const resultado = await spec()
      .get(`${BASE_URL}/${novoDeck.deck_id}/draw/?count=10`)
      .expectStatus(200)
      .returns('body');

    expect(resultado.remaining).toBe(42);
  });

  test('Embaralhar um baralho existente', async () => {
    const novoDeck = await spec()
      .get(`${BASE_URL}/new/`)
      .expectStatus(200)
      .returns('body');

    const embaralhar = await spec()
      .get(`${BASE_URL}/${novoDeck.deck_id}/shuffle/`)
      .expectStatus(200)
      .returns('body');

    expect(embaralhar.success).toBe(true);
    expect(embaralhar.shuffled).toBe(true);
  });

  test('Tentar comprar cartas de um baralho inexistente', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/invalid_id/draw/?count=1`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.error).toBeDefined();
  });

  test.skip('Criar múltiplos baralhos combinados', async () => {
    const reset = await spec()
      .get(`${BASE_URL}/new/shuffle/?deck_count=3`)
      .expectStatus(200)
      .returns('body');

    expect(reset.success).toBe(true);
    expect(reset.remaining).toBe(156);
    expect(reset.deck_id).toBeDefined();
  });
});


