const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('update.proto');
const updateProto = grpc.loadPackageDefinition(packageDefinition);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function updateProduct(call, callback) {
  const { id, descrip } = call.request;
  pool.query('UPDATE products SET descrip = \$2 WHERE id = \$1', [id, descrip], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id, descrip });
    }
  });
}

const server = new grpc.Server();
server.addService(updateProto.Update.service, { updateProduct });
server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Microservicio UPDATE en ejecucion')
});