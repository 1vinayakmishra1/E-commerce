async function getProduct() {
  const response = await fetch(`https://dummyjson.com/products`);
  const data = await response.json();

   console.log(data);
  
  const products = data.products;

  let productsHTML = '';

  products.forEach((product) => {

    productsHTML += 
      `<div class="product-container">

        <div class="product-img-div">
          <img src="https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp" alt="" class="product-img">
        </div>

        <div class="product-name">
        Black and Gray Athletic Cotton Socks - 6 Pairs
        </div>

        <div class="product-ratings">
        <img src="assets/ratings/rating-30.png" alt="">
        </div>

        <div class="price-div">
        $10
        </div>

        <div class="dropdown">

          <select name="numbers" id="numbers">
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

          <button class="add-to-cart">
          Add to Cart
          </button>
          
      </div>`;
  });
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
}

getProduct();