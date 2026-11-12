import('./scripts/server.mjs').then(({ startServer }) => startServer()).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
