import { cart, deliveryOptions } from "./cart.js";
import { getCartTotalQuantity } from "./cart.js";
import dayjs from "https://unpkg.com/dayjs/esm/index.js";
const allProducts = JSON.parse(localStorage.getItem('allProducts'));

export function renderOrderSummary() {

  let cartItemsHTML = '';

  cart.forEach(cartItem => {

    const matchingProduct = allProducts ? allProducts.find(product => product.id == cartItem.productId) : undefined;


    if (matchingProduct) {

    let deliveryOptionsHTML = '';
    deliveryOptions.forEach(option => {
      const today = dayjs();
      const deliveryDate = today.add(option.deliveryDays, 'day');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = option.priceCents === 0 ? 'FREE Shipping' : `$${(option.priceCents / 100).toFixed(2)} - Shipping`;

      const isChecked = cartItem.deliveryOptionId === option.id;

      deliveryOptionsHTML += `
        <div class="delivery-option">
          <input class="js-delivery-option-input" type="radio"
            name="delivery-option-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${option.id}"
            ${isChecked ? 'checked' : ''}>
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString}</div>
          </div>
        </div>
        `;
      });
    
    cartItemsHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">

      <div class="delivery-date">Delivery Date: Monday, July 27</div>

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

        <div class="delivery-options-main">
          <div class="delivery-options-title">Choose a delivery option:</div>

          <div class="delivery-options js-delivery-options">
          ${deliveryOptionsHTML}
          </div>

        </div>

      </div>

    </div>
    `;
    }
  });
  document.querySelector('.js-cart-summary').innerHTML = cartItemsHTML;
  document.querySelectorAll('.js-delivery-option-input').forEach(radio => {
    radio.addEventListener('change', (event) => {
      const productId = event.target.dataset.productId;
      const deliveryOptionId = event.target.dataset.deliveryOptionId;

      cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
          }
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      renderOrderSummary();
      paymentSummary();
    });
  });
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
      renderOrderSummary();
      paymentSummary();
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

      const selectedDeliveryOption = deliveryOptions.find(option => {
        return option.id === cartItem.deliveryOptionId;
      });

      if (selectedDeliveryOption) {
        shippingPriceCents += selectedDeliveryOption.priceCents;
      }
    }
  });

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