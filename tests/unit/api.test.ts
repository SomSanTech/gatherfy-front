import { useFetchData } from '../../composables/useFetchData';
import { jest, describe, expect, test, beforeAll } from '@jest/globals';

jest.mock('#app', () => ({
  useRuntimeConfig: jest.fn(() => ({
    public: {
      baseUrl: 'https://capstone24.sit.kmutt.ac.th/us1', // หรือค่าที่จำเป็นในการทดสอบ
    },
  })),
}));

test('GET events API ', async () => {
  const events = await useFetchData('v1/events', 'GET');
  expect(events.status).toEqual(200);
  expect(events.data).toBeDefined();
});

test('GET tags API ', async () => {
  const tags = await useFetchData('v1/tags', 'GET');
  expect(tags.status).toEqual(200);
  expect(tags.data).toHaveLength(6);
});
beforeAll(() => {
  jest.setTimeout(10000);
});
test('Test Singin success API ', async () => {
  const dataSend = {
    username: '00K',
    password: 'Ling0+7=7',
  };

  const fetchedData = await useFetchData(`v1/login`, 'POST', dataSend);

  expect(fetchedData.status).toEqual(200);
  expect(fetchedData.data.accessToken).toBeDefined;
  expect(fetchedData.data.refreshToken).toBeDefined;
});

test('GET event detail API ', async () => {
  const slug = 'orm-korns-graduation-gathering';

  const fetchedData = await useFetchData(`v1/events/${slug}`, 'GET');

  expect(fetchedData.status).toEqual(200);
  expect(fetchedData.data).toBeDefined;
});

test('Filter event tag API', async () => {
  const fetchedData = await useFetchData(`v1/events?tags=Technology`, 'GET');
  expect(fetchedData.status).toEqual(200);
  expect(fetchedData.data.length).toBeGreaterThan(0);
});
