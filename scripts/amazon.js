import { addToCart } from "./cart.js";
import { getCartTotalQuantity } from "./cart.js";

let allProducts = [];

async function getProduct() {
  const response = await fetch(`https://dummyjson.com/products?limit=200`);
  const data = await response.json();

   console.log(data);
  
  allProducts = data.products;
  renderProducts(allProducts);
}


function renderProducts(productsToRender) {
  
  let productsHTML = '';

  productsToRender.forEach((product) => {

    productsHTML += 
      `<div class="product-container js-product-container data-${product.id}">

        <div class="product-img-div">
          <img src="${product.thumbnail}" class="product-img">
        </div>

        <div class="product-name">
        ${product.title}
        </div>

        <div class="product-ratings">
        <img src="assets/ratings/rating-${((Math.round(product.rating * 2) / 2)*10)}.png" alt="">
        </div>

        <div class="price-div">
        $${(product.price)}
        </div>

        <div class="dropdown">

          <select name="numbers" id="${product.id}" class="js-product-quantity">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>

        </div>

          <button class="add-to-cart js-add-to-cart" data-product-id="${product.id}">
          Add to Cart
          </button>
          
      </div>`;
  });
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  const addBtn = document.querySelectorAll('.js-add-to-cart');

  addBtn.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;

      const quantity = Number(document.getElementById(productId).value);

      addToCart(productId, quantity);
      updateCartQuantityDisplay();
    });
  });
}

function updateCartQuantityDisplay() {
  const totalItems = getCartTotalQuantity();

  document.querySelector('.js-cart-items').innerHTML = totalItems;
}

getProduct();
updateCartQuantityDisplay();


const inputBar = document.querySelector('.js-input-bar');
const inputbtn = document.querySelector('.js-input-btn');
const suggestionsContainer = document.querySelector('.js-autocomplete-suggestions')

function searchQuery() {
    
    const filterValue = inputBar.value.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
      
      const matchesTitle = product.title.toLowerCase().includes(filterValue);
      const matchesDescription = product.description.toLowerCase().includes(filterValue);
      const matchesTags = product.tags && product.tags.some(tag => tag.toLowerCase().includes(filterValue));
      
      return matchesTitle || matchesDescription || matchesTags;

    });
    renderProducts(filteredProducts);
}
inputbtn.addEventListener('click', () => {
  searchQuery();
  inputBar.value = '';
  suggestionsContainer.innerHTML = '';
});

inputBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchQuery();
    inputBar.value = '';
    suggestionsContainer.innerHTML = '';
  }
});


function setupAutoComplete() {

  const filterValue = inputBar.value.toLowerCase();

  if (!filterValue) {
    suggestionsContainer.innerHTML = '';
    return;
  }

  const matchingSuggestions = allProducts.filter(product => {
    return product.title.toLowerCase().includes(filterValue)
  }).slice(0, 5);

  let suggestionHTMl = '';
  
  matchingSuggestions.forEach((product) => {
    suggestionHTMl += `
    <div class="autocomplete-item" data-suggestion="${product.title}">${product.title}</div>`;
  });
  suggestionsContainer.innerHTML = suggestionHTMl;

  document.querySelectorAll('.autocomplete-item').forEach(item => {
    item.addEventListener('click', () => {
      inputBar.value = item.dataset.suggestion;
      searchQuery();
      suggestionsContainer.innerHTML = '';
    })
  })
}

inputBar.addEventListener('input', () => {
  setupAutoComplete();
});

document.addEventListener('click', (event) => {
  if (!suggestionsContainer.contains(event.target) && event.target !== inputBar) {
    suggestionsContainer.innerHTML = '';
  }
});

  const themeBtn = document.querySelector('.js-theme-btn');
  themeBtn.innerHTML = `<img src="assets/icons/moon-svgrepo-com.svg" alt="">`
  const main = document.querySelector('.main');

  themeBtn.addEventListener('click', () => {
    themeChange();
  });

  function themeChange() {
    if (main.classList.contains('background-theme-on')) {
      main.classList.remove('background-theme-on');
      themeBtn.innerHTML = `<img src="assets/icons/moon-svgrepo-com.svg" alt="">`
    } else {
      main.classList.add('background-theme-on');
      themeBtn.innerHTML = `<img src="assets/icons/sun-svgrepo-com.svg" alt="">`
    }
  }




