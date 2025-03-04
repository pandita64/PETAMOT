class Carrito {
    // Añadir el producto al carrito
    comprarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const producto = e.target.parentElement;
            this.leerDatosProducto(producto);
        }
    }

    leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h5').textContent,
            precio: producto.querySelector('.precio').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        };

        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS) {
            if (productoLS.id === infoProducto.id) {
                productosLS = productoLS.id;
            }
        });

        if (productosLS === infoProducto.id) {
            Swal.fire({
                icon: 'warning',
                title: 'No tenemos stock suficiente, prueba con menos unidades',
                timer: 2500,
                showConfirmButton: false
            });
        } else {
            this.insertarCarrito(infoProducto);
            Swal.fire({
                icon: 'success',
                title: 'Agregado',
                timer: 2500,
                showConfirmButton: false
            });
        }
    }

    insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);
    }

    vaciarCarrito(e) {
        e.preventDefault();
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
            Swal.fire({
                icon: 'info',
                title: 'Carrito Vacío',
                timer: 2500,
                showConfirmButton: false
            });
        }
        this.vaciarLocalStorage();
        return false;
    }

    guardarProductosLocalStorage(producto) {
        let productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    obtenerProductosLocalStorage() {
        let productoLS;
        if (localStorage.getItem('productos') === null) {
            productoLS = [];
        } else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    eliminarProductoLocalStorage(productoID) {
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS, index) {
            if (productoLS.id === productoID) {
                productosLS.splice(index, 1);
            }
        });
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    leerLocalStorage() {
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    leerLocalStorageCompra() {
        let productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    vaciarLocalStorage() {
        localStorage.clear();
    }

    procesarPedido(e) {
        e.preventDefault();
        if (this.obtenerProductosLocalStorage().length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'El carrito está vacío, agrega un producto',
                timer: 2500,
                showConfirmButton: false
            });
        } else {
            location.href = "carrito.html";
        }
    }

    calcularTotal() {
        let productoLS = this.obtenerProductosLocalStorage();
        let total = 0;

        productoLS.forEach(producto => {
            total += parseFloat(producto.precio.replace(/[^\d.-]/g, '')) * producto.cantidad;
        });

        // Formato para pesos colombianos
        const options = { style: 'currency', currency: 'COP' };
        const formattedTotal = total.toLocaleString('es-CO', options);

        document.getElementById('total').value = formattedTotal;
    }
}

