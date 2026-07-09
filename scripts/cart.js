let cart = 0;
document.querySelector('.js-cart-items').innerHTML = `${cart}`;

export function addToCart() {
  const addBtn = document.querySelectorAll('.js-add-to-cart');

  addBtn.forEach((button) => {
    button.addEventListener('click', () => {
      cart++;
      console.log(cart);
      document.querySelector('.js-cart-items').innerHTML = `${cart}`;
    });
  });
}


