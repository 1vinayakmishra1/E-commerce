let cart = [];

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
      quantity: quantity
    });
  }
}

export function getCartTotalQuantity() {
  let totalProducts = 0;

  cart.forEach((item) => {
    totalProducts += item.quantity;
  });

  return totalProducts;
}

