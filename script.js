document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Lista de productos para paginación
    const productos = [
        { product: "Heineken", price: 5.50, image: "img/CervezaHeineken.png", description: "Cerveza - Lata 330ml" },
        { product: "Corona", price: 5.00, image: "img/Corona.png", description: "Cerveza - Botella 330ml" },
        { product: "Cusqueña Dorada", price: 5.50, image: "img/Cusquenadorada.jpg", description: "Cerveza - Botella 330ml" },
        { product: "Johnnie Walker Red Label", price: 52.90, image: "img/JohnnieWalkerRedLabel.png", description: "Whisky - Botella 750ml" },
        { product: "Pilsen Callao", price: 6.00, image: "img/PilsenCallao.jpg", description: "Cerveza - Botella 620ml" },
        { product: "Pilsen Trujillo", price: 6.20, image: "img/PilsenTrujillo.jpg", description: "Cerveza - Botella 620ml" },
        { product: "Cuatro Gallos", price: 84.90, image: "img/PiscoCuatroGallos.png", description: "Pisco - Quebranta 700ml" },
        { product: "Tabernero Borgoña Semi-Seco", price: 16.50, image: "img/TaberneroBorgonaSemi-Seco.png", description: "Vino - Botella 750ml" },
        { product: "Absolut Vodka", price: 44.90, image: "img/VodkaAbsolut.png", description: "Vodka - Botella 700ml" },
        { product: "Smirnoff Vodka", price: 59.90, image: "img/VodkaSmirnoff.png", description: "Vodka - Botella 700ml" }
    ];

    // Agregar producto al carrito
    document.querySelectorAll('.btn-agregar-pro').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.getAttribute('data-image');
            const quantity = 1;

            const item = cart.find(item => item.product === product);
            if (item) {
                item.quantity += quantity;
            } else {
                cart.push({ product, price, image, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`¡${product} agregado al carrito!`);
            updateCartDisplay();
        });
    });

    // Actualizar contador del carrito
    function updateCartCount() {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        console.log('Conteo del carrito:', cartCount); // Depuración
        document.querySelectorAll('.cart-count').forEach(count => {
            count.textContent = `(${cartCount})`;
            count.parentElement.setAttribute('aria-label', `Carrito de compras con ${cartCount} ítems`);
        });
    }

    // Mostrar notificación
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.setAttribute('aria-live', 'polite');
        document.body.appendChild(notification);
        notification.style.display = 'block';
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Actualizar visualización del carrito
    function updateCartDisplay() {
        const cartItems = document.getElementById('carrito-items');
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Tu carrito está vacío. <a href="Producto.html">Explora productos</a>.</p>';
            } else {
                cartItems.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'carrito-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.product}" width="50" height="50">
                        <div class="item-info">
                            <h4>${item.product}</h4>
                            <span class="price">S/ ${item.price.toFixed(2)}</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                        <button class="remove-btn" data-product="${item.product}"><i class="fas fa-trash"></i></button>
                    `;
                    cartItems.appendChild(cartItem);

                    // Control de cantidad
                    cartItem.querySelectorAll('.quantity-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const action = btn.getAttribute('data-action');
                            const input = cartItem.querySelector('.quantity-input');
                            let quantity = parseInt(input.value);
                            if (action === 'increase') quantity++;
                            else if (action === 'decrease' && quantity > 1) quantity--;
                            input.value = quantity;
                            item.quantity = quantity;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCartDisplay();
                            updateSummary();
                        });
                    });

                    // Validar entrada manual
                    cartItem.querySelector('.quantity-input').addEventListener('input', (e) => {
                        let quantity = parseInt(e.target.value);
                        if (isNaN(quantity) || quantity < 1) {
                            quantity = 1;
                            e.target.value = 1;
                        }
                        item.quantity = quantity;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartDisplay();
                        updateSummary();
                    });

                    // Eliminar producto
                    cartItem.querySelector('.remove-btn').addEventListener('click', () => {
                        cart = cart.filter(i => i.product !== item.product);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        updateCartDisplay();
                        updateCartCount();
                        updateSummary();
                    });
                });
            }
            updateSummary();
        }
    }

    // Actualizar resumen del carrito
    function updateSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal;
        document.getElementById('subtotal').textContent = `S/ ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `S/ ${total.toFixed(2)}`;
    }

    // Paginación
    function mostrarProductos(pagina) {
        const productosPorPagina = 6;
        const inicio = (pagina - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosMostrar = productos.slice(inicio, fin);

        const productosGrid = document.querySelector('.productos-grid');
        if (productosGrid) {
            productosGrid.innerHTML = '';
            productosMostrar.forEach(item => {
                const productoCard = document.createElement('div');
                productoCard.className = 'producto-card';
                productoCard.innerHTML = `
                    <div class="producto-image">
                        <img src="${item.image}" alt="${item.product}" width="250" height="200" loading="lazy">
                    </div>
                    <div class="producto-info">
                        <h3>${item.product}</h3>
                        <p>${item.description}</p>
                        <div class="precio-agregar">
                            <span class="precio">S/ ${item.price.toFixed(2)}</span>
                            <button class="btn-agregar-pro" data-product="${item.product}" data-price="${item.price}" data-image="${item.image}">Agregar</button>
                        </div>
                    </div>
                `;
                productosGrid.appendChild(productoCard);
            });

            // Reasignar eventos a los nuevos botones
            document.querySelectorAll('.btn-agregar-pro').forEach(button => {
                button.addEventListener('click', () => {
                    const product = button.getAttribute('data-product');
                    const price = parseFloat(button.getAttribute('data-price'));
                    const image = button.getAttribute('data-image');
                    const quantity = 1;

                    const item = cart.find(item => item.product === product);
                    if (item) {
                        item.quantity += quantity;
                    } else {
                        cart.push({ product, price, image, quantity });
                    }

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    showNotification(`¡${product} agregado al carrito!`);
                    updateCartDisplay();
                });
            });
        }
    }

    // Configurar paginación
    const pageButtons = document.querySelectorAll('.page-btn');
    if (pageButtons.length > 0) {
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.page-btn.active')?.classList.remove('active');
                button.classList.add('active');
                const pagina = parseInt(button.textContent);
                mostrarProductos(pagina);
            });
        });
        // Cargar la primera página
        pageButtons[0].classList.add('active');
        mostrarProductos(1);
    }

    // Botón de pago
    const btnPagar = document.getElementById('btn-pagar');
    if (btnPagar) {
        btnPagar.addEventListener('click', () => {
            if (cart.length > 0) {
                // TODO: Integrar con pasarela de pago (ej. Stripe, PayPal)
                alert('¡Pago realizado con éxito! Gracias por tu compra.');
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Validación de formularios
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                showNotification('Por favor, ingresa un correo válido.');
                return;
            }
            // TODO: Enviar datos al backend
            showNotification('¡Suscripción exitosa!');
            newsletterForm.reset();
        });
    }

    const contactoForm = document.querySelector('.contacto-form');
    if (contactoForm) {
        contactoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = contactoForm.querySelector('input[type="text"]').value;
            const email = contactoForm.querySelector('input[type="email"]').value;
            const mensaje = contactoForm.querySelector('textarea').value;
            if (!nombre || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !mensaje) {
                showNotification('Por favor, completa todos los campos requeridos.');
                return;
            }
            // TODO: Enviar datos al backend
            showNotification('¡Mensaje enviado con éxito!');
            contactoForm.reset();
        });
    }

    // Cargar carrito al iniciar
    updateCartCount();
    updateCartDisplay();
});