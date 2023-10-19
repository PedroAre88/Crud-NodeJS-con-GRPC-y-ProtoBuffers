const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('read.proto');
const readProto = grpc.loadPackageDefinition(packageDefinition);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getProduct(call, callback) {
  const { id } = call.request;
  pool.query('SELECT * FROM products WHERE id = \$1', [id], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results.rows[0]);
    }
  });
}

const server = new grpc.Server();
server.addService(readProto.Read.service, { getProduct });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Microservicio READ en ejecucion')
});