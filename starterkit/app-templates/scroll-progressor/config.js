const defaultWaypoint = {
  id: 'default',
  label: 'Standardansicht',
  many: {properties: 'cool'},
};

const config = {
  waypoints: [
    {
      ...defaultWaypoint,
      example: 'cool! 🎉',
    },
    {
      ...defaultWaypoint,
      id: 'first-one',
      example: 'yay 😄',
    },
    {
      ...defaultWaypoint,
      id: 'second-one',
      example: 'wow 🚀',
    },
    {
      ...defaultWaypoint,
      id: 'third-one',
      example: 'woop 🐶',
    },
  ],
};

export default config;
