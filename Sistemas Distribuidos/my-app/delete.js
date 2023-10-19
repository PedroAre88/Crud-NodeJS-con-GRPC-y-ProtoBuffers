const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('delete.proto');
const deleteProto = grpc.loadPackageDefinition(packageDefinition);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function deleteProduct(call, callback) {
  const { id } = call.request;
  pool.query('DELETE FROM products WHERE id = \$1', [id], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id });
    }
  });
}

const server = new grpc.Server();
server.addService(deleteProto.Delete.service, { deleteProduct });
server.bindAsync('0.0.0.0:50054', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('Microservicio DELETE en ejecucion')
});