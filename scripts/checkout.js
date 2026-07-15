import { cart } from "./cart.js";
import { getCartTotalQuantity } from "./cart.js";
const allProducts = JSON.parse(localStorage.getItem('allProducts'));

export function renderOrderSummary() {
  let cartItemsHTML = '';

  cart.forEach(cartItem => {

    const matchingProduct = allProducts ? allProducts.find(product => product.id == cartItem.productId) : undefined;


    if (matchingProduct) {
    
    cartItemsHTML += `
    <div class="cart-item-container">

      <div class="delivery-date">Delivery Date: Monday, July 20</div>

      <div class="cart-item-details-grid">

        <img src="${matchingProduct.thumbnail}" alt="">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.title}</div>
          <div class="product-price">$${matchingProduct.price}</div>
          <div class="product-quantity">
            Quantity: ${cartItem.quantity} 
            <button class="update-btn">Update</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>

          <div class="delivery-option">
            <input type="radio" name="delivery-option-${matchingProduct.id}" id="delivery-1-${matchingProduct.id}" checked>
            <div><div class="delivery-option-date">Monday, July 20</div>
            <div class="delivery-option-price">FREE Shipping</div></div>
          </div>

          <div class="delivery-option">
            <input type="radio" name="delivery-option-${matchingProduct.id}" id="delivery-2-${matchingProduct.id}">
            <div><div class="delivery-option-date">Tuesday, July 14</div>
            <div class="delivery-option-price">4.99-Shipping</div></div>
          </div>

          <div class="delivery-option">
            <input type="radio" name="delivery-option-${matchingProduct.id}" id="delivery-3-${matchingProduct.id}">
            <div><div class="delivery-option-date">Friday, July 10</div>
            <div class="delivery-option-price">9.99-Shipping</div></div>
          </div>

        </div>

      </div>

    </div>
    `;
    }
  });
  document.querySelector('.js-cart-summary').innerHTML = cartItemsHTML;
  const totalItems = getCartTotalQuantity();
  document.querySelector('.js-header-center').innerHTML = `Checkout (<span class='cartQuantityItems'>${totalItems} items</span>)`;
}
renderOrderSummary();