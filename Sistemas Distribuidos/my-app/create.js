const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('create.proto');
const createProto = grpc.loadPackageDefinition(packageDefinition);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function createProduct(call, callback) {
  const { id, descrip } = call.request;
  pool.query('INSERT INTO products(id, descrip) VALUES(\$1, \$2)', [id, descrip], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id, descrip });
    }
  });
}

const server = new grpc.Server();
server.addService(createProto.Create.service, { createProduct });
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Microservicio CREATE en ejecucion')
});