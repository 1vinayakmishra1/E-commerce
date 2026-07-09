let cart = 0;
const cartQuantity = document.querySelector('.js-cart-items');
cartQuantity.innerHTML = `${cart}`;

export function addToCart() {
  const addBtn = document.querySelectorAll('.js-add-to-cart');

  addBtn.forEach((button) => {
    button.addEventListener('click', () => {

      const productId = button.dataset.productId;

      const productContainer = button.closest('.product-container');
      const quantitySelector = productContainer.querySelector('.js-product-quantity');
      const selectedQuantity = Number(quantitySelector.value);

      

      cart += selectedQuantity;
      console.log(cart);
      cartQuantity.innerHTML = `${cart}`;
    });
  });
}


