// vitest.config.js
export default {
  test: {
    environment: 'node',      // necesario para tests de Node.js
    globals: true,            // permite usar describe/test/expect sin importarlos
    fileParallelism: false,   // ejecuta los tests uno por uno (útil para DB)
    testTimeout: 20000        // timeout extendido para consultas a DB
  }
};