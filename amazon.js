async function getProduct() {
  const response = await fetch(`https://dummyjson.com/products`);
  const data = await response.json();
  
  console.log(data);
  
}
getProduct();

data.products.forEach(() => {
  
});