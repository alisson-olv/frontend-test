import { getProducts } from './services/productsService.js';
import { getStateFromZip } from './services/cepService.js';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  const existingProduct = cart.find((item) => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartModal();
}

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);
  saveCart();
  updateCartModal();
}

function updateCartModal() {
  const cartItemsContainer = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');
  cartItemsContainer.innerHTML = '';

  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.pricing.final_price_brl * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement('div');
    cartItemElement.classList.add('flex', 'justify-between', 'items-center');
    cartItemElement.innerHTML = `
      <p>${item.name} (x${item.quantity}) - R$ ${itemTotal.toFixed(2)}</p>
      <button class="text-red-500 cursor-pointer" data-name="${
        item.name
      }">Remover</button>
    `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotalElement.textContent = `${total.toFixed(2)}`;

  cartItemsContainer.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      removeFromCart(e.target.dataset.name);
    });
  });
}

document.querySelector('#open-cart').addEventListener('click', () => {
  const cartModal = document.querySelector('#cart-modal');
  cartModal.classList.remove('hidden');
  updateCartModal();
});

function renderProducts(products) {
  const productContainer = document.querySelector('#product-list');
  productContainer.innerHTML = '';

  if (!Array.isArray(products) || products.length === 0) {
    productContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add(
      'flex',
      'flex-col',
      'gap-3',
      'bg-white',
      'rounded-lg',
      'p-5',
      'justify-between'
    );

    productElement.innerHTML = `
      <div class="flex flex-col gap-2">
        <p class="font-bold">${product.name}</p>
        <p class="text-sm">${product.desc}</p>
        <p class="text-sm">${product.category}</p>
        <p class="text-sm">R$ ${product.pricing.price_brl}</p>
        ${
          product.pricing.discount_brl
            ? `<p class="text-sm">Desconto: <span>R$ ${product.pricing.discount_brl}</span></p><p class="text-sm">Preço com Desconto: R$ ${product.pricing.final_price_brl}</p>`
            : ''
        }
        <p class="text-sm">Estado: <span>${product.state}</span></p>
      </div>
      <button class="bg-[#18a661] text-white py-2 px-4 rounded-lg hover:bg-[#063940] add-to-cart cursor-pointer">Add ao Carrinho</button>
    `;

    productElement
      .querySelector('.add-to-cart')
      .addEventListener('click', () => addToCart(product));

    productContainer.appendChild(productElement);
  });
}

async function loadProducts(productName = '', stateFilter = '') {
  const loadingSpinner = document.querySelector('#loading-spinner');
  const productContainer = document.querySelector('#product-list');

  productContainer.innerHTML = '';

  loadingSpinner.classList.remove('hidden');

  try {
    const products = await getProducts(productName);
    const filteredProducts = stateFilter
      ? products.filter(
          (product) => product.state.toUpperCase() === stateFilter.toUpperCase()
        )
      : products;

    if (Array.isArray(filteredProducts)) {
      renderProducts(filteredProducts);
    } else {
      console.error(
        'The API response does not contain a valid list of products.'
      );
      productContainer.innerHTML = '<p>Erro ao carregar os produtos.</p>';
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    productContainer.innerHTML = '<p>Erro ao carregar os produtos.</p>';
  } finally {
    loadingSpinner.classList.add('hidden');
  }
}

async function handleCepSearchClick() {
  const searchCepInput = document.querySelector('#search-cep');
  const searchInput = document.querySelector('#search-items');
  const cepValue = searchCepInput.value.trim();

  if (cepValue) {
    try {
      const state = await getStateFromZip(cepValue);
      if (state) {
        searchInput.value = '';
        loadProducts('', state);
      } else {
        console.error('State not found');
      }
    } catch (error) {
      console.error('Error fetching state:', error);
    }
  }
}

function handleSearchClick() {
  const searchInput = document.querySelector('#search-items');
  const searchCepInput = document.querySelector('#search-cep');
  const productName = searchInput.value.trim();

  if (productName) {
    searchCepInput.value = '';
    loadProducts(productName);
  }
}

function setupCartModal() {
  const cartModal = document.createElement('div');
  cartModal.id = 'cart-modal';
  cartModal.classList.add(
    'hidden',
    'fixed',
    'inset-0',
    'bg-gray-900',
    'bg-opacity-50',
    'flex',
    'items-center',
    'justify-center'
  );

  cartModal.innerHTML = `
    <div class="bg-white p-5 rounded-lg w-[400px]">
      <h2 class="text-xl font-bold mb-4">Seu Carrinho</h2>
      <div id="cart-items" class="flex flex-col gap-3"></div>
      <p id="cart-total" class="font-bold mt-4">0,00</p>
      <button id="close-cart" class="mt-5 bg-[#18a661] text-white py-2 px-4 rounded-lg hover:bg-[#063940] w-full">Fechar</button>
    </div>
  `;

  document.body.appendChild(cartModal);

  document.querySelector('#close-cart').addEventListener('click', () => {
    const cartModal = document.querySelector('#cart-modal');
    cartModal.classList.add('hidden');
    updateCartModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('#search-button-items');
  const searchCepButton = document.querySelector('#search-button-cep');

  loadProducts();
  setupCartModal();

  searchButton.addEventListener('click', handleSearchClick);
  searchCepButton.addEventListener('click', handleCepSearchClick);
});
