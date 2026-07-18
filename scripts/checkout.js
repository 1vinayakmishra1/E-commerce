import { cart } from "./cart.js";
import { getCartTotalQuantity } from "./cart.js";
const allProducts = JSON.parse(localStorage.getItem('allProducts'));

export function renderOrderSummary() {
  let cartItemsHTML = '';

  cart.forEach(cartItem => {

    const matchingProduct = allProducts ? allProducts.find(product => product.id == cartItem.productId) : undefined;


    if (matchingProduct) {
    
    cartItemsHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">

      <div class="delivery-date">Delivery Date: Monday, July 20</div>

      <div class="cart-item-details-grid">

        <img src="${matchingProduct.thumbnail}" alt="">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.title}</div>
          <div class="product-price">$${(matchingProduct.price).toFixed(2)}</div>
          <div class="product-quantity">
            Quantity: <span class="js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              
              <span class="js-quantity-editing-container js-quantity-editing-container-${matchingProduct.id}">
                <input class="new-quantity-input js-new-quantity-input-${matchingProduct.id}" type="number" min="1" value="${cartItem.quantity}" data-testid="new-quantity-input">
                <button class="save-btn js-save-btn" data-product-id="${matchingProduct.id}">Save</button>
              </span>
              
              <button class="update-btn js-update-btn" data-product-id="${matchingProduct.id}">Update</button>
              <button class="delete-btn js-delete-btn" data-product-id="${matchingProduct.id}">Delete</button>

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
  const cartHeader = document.querySelector('.js-header-center');
  cartHeader.innerHTML = `Checkout (<span class='cartQuantityItems'>${totalItems} items</span>)`;

  const deleteBtn = document.querySelectorAll('.js-delete-btn');
  
  deleteBtn.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const indexToDelete = cart.findIndex(item => item.productId === productId);

      if (indexToDelete !== -1) {
        cart.splice(indexToDelete, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      paymentSummary();
      renderOrderSummary();
    });
  });


  const updateBtn = document.querySelectorAll('.js-update-btn');

  updateBtn.forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);

      if (cartItemContainer) {
        cartItemContainer.classList.add('is-editing');

        const newQuantityInput = cartItemContainer.querySelector(`.js-new-quantity-input-${productId}`);
        const currentCartItems = cart.find(item => String(item.productId) === productId);
        if(newQuantityInput && currentCartItems) {
          newQuantityInput.value = currentCartItems.quantity;
        }
      }
    });
  });

  const saveBtn = document.querySelectorAll('.js-save-btn');

  saveBtn.forEach((button) => {
    button.addEventListener('click', (saveEvent) => {
      const savedProductId = saveEvent.target.dataset.productId;
      const cartItemContainer = document.querySelector(`.js-cart-item-container-${savedProductId}`);
      
      const newQuantityInput = cartItemContainer.querySelector(`.js-new-quantity-input-${savedProductId}`);
      const newQuantity = Number(newQuantityInput.value);

      const indexToUpdate = cart.findIndex(item => String(item.productId) === savedProductId);

      if (indexToUpdate !== -1) {
        cart[indexToUpdate].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      paymentSummary();
      renderOrderSummary();
    });
  });
  paymentSummary();
}
renderOrderSummary();


export function paymentSummary() {
  let itemsPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const matchingProduct = allProducts ? allProducts.find(product => product.id == cartItem.productId) : undefined;
 

    if(matchingProduct) {
      itemsPriceCents += (matchingProduct.price * 100) * cartItem.quantity;
    }
  });

  if (cart.length > 0) {
    shippingPriceCents = 499
  } else {
    shippingPriceCents = 0;
  }

  const totalBeforeTaxCents = itemsPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.10);
  const orderTotalCents = totalBeforeTaxCents + taxCents;

  document.querySelector('.js-payment-items-quantity').innerHTML = getCartTotalQuantity();
  document.querySelector('.js-items-total').innerHTML = `$${(itemsPriceCents / 100).toFixed(2)}`;
  document.querySelector('.js-shipping-cost').innerHTML = `$${(shippingPriceCents / 100).toFixed(2)}`;
  document.querySelector('.js-total-before-tax').innerHTML = `$${(totalBeforeTaxCents / 100).toFixed(2)}`;
  document.querySelector('.js-estimated-tax').innerHTML = `$${(taxCents / 100).toFixed(2)}`;
  document.querySelector('.js-order-total').innerHTML = `$${(orderTotalCents / 100).toFixed(2)}`;
}