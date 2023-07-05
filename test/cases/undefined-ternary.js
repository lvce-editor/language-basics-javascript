export const config = {
  maxThreads: process.env.TEST_ENV === 'dev' ? 1 : undefined,
}