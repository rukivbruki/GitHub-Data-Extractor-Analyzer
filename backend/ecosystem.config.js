module.exports = {
  apps: [
    {
      script: './service/service.js',
      args: '--server',
      instances: 4,
      exec_mode: 'cluster',
    },
  ],
};
