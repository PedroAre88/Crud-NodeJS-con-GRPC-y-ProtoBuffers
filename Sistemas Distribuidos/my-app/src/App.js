import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:50051/GetAllProducts')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const createProduct = async () => {
    const id = products.length + 1;
    const descrip = prompt('Ingrese la descripción del producto:');
    const response = await axios.post('http://localhost:50052/CreateProduct', { id, descrip });
    setProducts([...products, response.data]);
  };

  const updateProduct = async (id) => {
    const descrip = prompt('Ingrese la nueva descripción del producto:');
    const response = await axios.post('http://localhost:50053/UpdateProduct', { id, descrip });
    setProducts(products.map(product => product.id === id ? response.data : product));
  };

  const deleteProduct = async (id) => {
    await axios.post(`http://localhost:50054/DeleteProduct?id=${id}`);
    setProducts(products.filter(product => product.id !== id));
  };

  const data = React.useMemo(() => products, [products]);
  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Descripción',
      accessor: 'descrip',
    },
    {
      Header: 'Acciones',
      id: 'actions',
      accessor: (row) => {
        return (
          <div>
            <button onClick={() => updateProduct(row.id)}>Actualizar</button>
            <button onClick={() => deleteProduct(row.id)}>Borrar</button>
          </div>
        );
      },
    },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      <button onClick={createProduct}>Crear Producto</button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
