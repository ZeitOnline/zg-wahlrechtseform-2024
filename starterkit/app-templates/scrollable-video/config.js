import testMeta from 'src/public/videostills/test.json';

const config = {
  videos: [
    {
      identifier: 'test',
      meta: testMeta,
      nFrames: 3,
      frameRate: 1,
      padLength: 3,
      dimensions: {
        mobile: {
          width: 400,
          height: 800,
        },
        desktop: {
          width: 1920,
          height: 1080,
        },
      },
      annotations: null,
      setup: null,
      debug: null,
    },
  ],
  // lotties rein über pembed Attribute gesteuert
};

export default config;
