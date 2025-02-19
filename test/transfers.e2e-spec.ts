import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const limitErrorMessages = [
  'limit must not be greater than 100',
  'limit must not be less than 1',
  'limit must be an integer number',
];

const endDateErrorMessages = [
  'endDate should not be empty',
  'endDate must be a valid ISO 8601 date string',
];

const startDateErrorMessages = [
  'startDate should not be empty',
  'startDate must be a valid ISO 8601 date string',
];

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/transfers/total-transferred?startDate=2025-01-01&endDate=2025-02-28 (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2025-01-01&endDate=2025-02-28',
    );

    expect(res.status).toBe(200);
    expect(BigInt(res.text) >= 0).toBe(true);
  });

  it('/transfers/total-transferred?startDate=2024-02-01&endDate=2024-02-10 (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2024-02-01&endDate=2024-02-10',
    );

    expect(res.status).toBe(200);
    expect(BigInt(res.text) >= 0).toBe(true);
  });

  it('/transfers/total-transferred?startDate=2036-02-01&endDate=2036-02-10 (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2036-02-01&endDate=2036-02-10',
    );

    expect(res.status).toBe(200);
    expect(Number(res.text)).toBe(0);
  });

  it('/transfers/total-transferred?startDate=2025-01-01&endDate= (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2025-01-01&endDate=',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(endDateErrorMessages.length);
    expect(res.body.message[0]).toBe(endDateErrorMessages[0]);
    expect(res.body.message[1]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?startDate=2025-01-01 (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2025-01-01',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(endDateErrorMessages.length);
    expect(res.body.message[0]).toBe(endDateErrorMessages[0]);
    expect(res.body.message[1]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?startDate=2025-01-01&endDate=a (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?startDate=2025-01-01&endDate=a',
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?endDate=2025-02-28&startDate= (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=2025-02-28&startDate=',
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(startDateErrorMessages[0]);
  });

  it('/transfers/total-transferred?endDate=2025-02-28 (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=2025-02-28',
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(startDateErrorMessages[0]);
  });

  it('/transfers/total-transferred?endDate=2025-02-28&startDate=a (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=2025-02-28&startDate=a',
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(startDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?endDate=&startDate= (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=&startDate=',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(
      [...endDateErrorMessages, ...startDateErrorMessages].length,
    );
    expect(res.body.message[0]).toBe(startDateErrorMessages[0]);
    expect(res.body.message[1]).toBe(startDateErrorMessages[1]);
    expect(res.body.message[2]).toBe(endDateErrorMessages[0]);
    expect(res.body.message[3]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?endDate=a&startDate=a (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=a&startDate=a',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(2);
    expect(res.body.message[0]).toBe(startDateErrorMessages[1]);
    expect(res.body.message[1]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?endDate=a&startDate= (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=a&startDate=',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(3);
    expect(res.body.message[0]).toBe(startDateErrorMessages[0]);
    expect(res.body.message[1]).toBe(startDateErrorMessages[1]);
    expect(res.body.message[2]).toBe(endDateErrorMessages[1]);
  });

  it('/transfers/total-transferred?endDate=&startDate=a (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/total-transferred?endDate=&startDate=a',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(3);
    expect(res.body.message[0]).toBe(startDateErrorMessages[1]);
    expect(res.body.message[1]).toBe(endDateErrorMessages[0]);
    expect(res.body.message[2]).toBe(endDateErrorMessages[1]);
  });

  const one = 1;
  it(`/transfers/top-accounts?limit=${one} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${one}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(one);
  });

  const ten = 10;
  it(`/transfers/top-accounts?limit=${ten} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${ten}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(ten);
    for (let i = 0; i < ten - 1; ++i) {
      expect(
        BigInt(res.body[i].totalVolume) >= BigInt(res.body[i + 1].totalVolume),
      ).toBe(true);
    }
  });

  const hundred = 100;
  it(`/transfers/top-accounts?limit=${hundred} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${hundred}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(hundred);
    for (let i = 0; i < hundred - 1; ++i) {
      expect(
        BigInt(res.body[i].totalVolume) >= BigInt(res.body[i + 1].totalVolume),
      ).toBe(true);
    }
  });

  const hundredOne = 101;
  it(`/transfers/top-accounts?limit=${hundredOne} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${hundredOne}`,
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(limitErrorMessages[0]);
  });

  it('/transfers/top-accounts (GET)', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transfers/top-accounts',
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(limitErrorMessages.length);
    expect(res.body.message[0]).toBe(limitErrorMessages[0]);
    expect(res.body.message[1]).toBe(limitErrorMessages[1]);
    expect(res.body.message[2]).toBe(limitErrorMessages[2]);
  });

  const zero = 0;
  it(`/transfers/top-accounts?limit=${zero} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${zero}`,
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(limitErrorMessages[1]);
  });

  const letter = 'A';
  it(`/transfers/top-accounts?limit=${letter} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${letter}`,
    );

    expect(res.status).toBe(400);
    expect(res.body.message.length).toBe(limitErrorMessages.length);
    expect(res.body.message[0]).toBe(limitErrorMessages[0]);
    expect(res.body.message[1]).toBe(limitErrorMessages[1]);
    expect(res.body.message[2]).toBe(limitErrorMessages[2]);
  });

  const specialCharacter = '#';
  it(`/transfers/top-accounts?limit=${specialCharacter} (GET)`, async () => {
    const res = await request(app.getHttpServer()).get(
      `/transfers/top-accounts?limit=${specialCharacter}`,
    );

    expect(res.status).toBe(400);
    expect(res.body.message[0]).toBe(limitErrorMessages[1]);
  });
});
