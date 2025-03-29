// __mocks__/nuxt.js
export const useRuntimeConfig = jest.fn(() => ({
  public: {
    baseUrl: 'https://capstone24.sit.kmutt.ac.th/us1', // mock ค่าที่จำเป็น
  },
}));
