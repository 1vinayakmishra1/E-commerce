export let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function addToCart(productId, quantity) {
  let itemFound = false;

  cart.forEach((item) => {

    if (item.productId === productId) {
      item.quantity += quantity;
      itemFound = true;
    }
  });
  if (itemFound === false) {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '7-days'
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartTotalQuantity() {
  let totalProducts = 0;

  cart.forEach((item) => {
    totalProducts += item.quantity;
  });

  return totalProducts;
}

export const deliveryOptions = [{
  id: '7-days',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '3-days',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '1-day',
  deliveryDays: 1,
  priceCents: 999
}];

