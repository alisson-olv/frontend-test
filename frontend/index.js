import { getProducts } from './services/productsService.js';
import { getStateFromZip } from './services/cepService.js';

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
      'p-5'
    );

    productElement.innerHTML = `
      <p class="font-bold">${product.name}</p>
      <p class="text-sm">${product.desc}</p>
      <p class="text-sm">${product.category}</p>
      <p class="text-sm">R$ ${product.pricing.price_brl}</p>
      ${
        product.pricing.discount_brl
          ? `<p class="text-sm">Desconto: <span>R$ ${product.pricing.discount_brl}</span></p>
          <p class="text-sm">Preço com Desconto: R$ ${product.pricing.final_price_brl}</p>`
          : ''
      }
      
      <p class="text-sm">Estado: <span>${product.state}</span></p>
    `;

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

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('#search-button-items');
  const searchCepButton = document.querySelector('#search-button-cep');

  loadProducts();

  searchButton.addEventListener('click', handleSearchClick);
  searchCepButton.addEventListener('click', handleCepSearchClick);
});
