//All the logics that are required for displaying products on the basis of category and subcategory filter products view products and adding header and footer

// Import the product data from the external file
import { allProducts } from "./data.js";
import {addCartToHTML,addCartToMemory} from "./common.js";
//add to cart function

export let cart=[];
const body = document.body;
export const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity =
      cart[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};

// Function to display products based on category and subcategory
export function displayProducts(category, subcategory = null) {
  document.addEventListener("DOMContentLoaded", () => {
    // Find the matching category
    const categoryData = allProducts.find((cat) => cat.category === category);
    if (!categoryData) {
      return;
    }

    // Filter products based on category and subcategory
    let filteredProducts = categoryData.products;
    if (subcategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.subCategory === subcategory
      );
    }
    updateProductDisplay(filteredProducts);
  });
}

// Ensure the function is defined in the global scope
function viewProduct(id) {
  // Redirect to the product detail page with the product ID
  window.location.href = `/html/AddProductPage.html?id=${id}`;
}
// Function to update the product display this function is used inside this file
function updateProductDisplay(products) {
    // Take only the first 20 products
    const productsToDisplay = products.slice(0, 20);

    // Display filtered products
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = ''; // Clear previous products

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product');
        productCard.addEventListener('click', (event) => {
          if (event.target.tagName !== 'BUTTON') {
          viewProduct(product.id);
          }
      });
  
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button data-id=${product.id} class="addCart">Add to Cart</button>`;
        productContainer.appendChild(productCard);
    });
    
    productContainer.addEventListener("click", (event) => {
      let positionClick = event.target;
      if (positionClick.classList.contains("addCart")) {
        body.classList.toggle("showCart");
        let id_product = positionClick.dataset.id;
        addToCart(id_product);
      }
    });
  }



//sort product(used in common js file)

export function sortProducts(criteria) {
  const productsContainer = document.getElementById("productContainer");
  const products = Array.from(
    productsContainer.getElementsByClassName("product")
  );

  products.sort((a, b) => {
    // Extract product names
    const nameA = a.querySelector("h3").textContent.toLowerCase();
    const nameB = b.querySelector("h3").textContent.toLowerCase();

    // Extract and parse prices
    const priceA = parseFloat(
      a.querySelector("p").textContent.replace("Rs. ", "").replace(/,/g, "")
    );
    const priceB = parseFloat(
      b.querySelector("p").textContent.replace("Rs. ", "").replace(/,/g, "")
    );

    switch (criteria) {
      case "az":
        return nameA.localeCompare(nameB);
      case "za":
        return nameB.localeCompare(nameA);
      case "low-high":
        return priceA - priceB;
      case "high-low":
        return priceB - priceA;
      default:
        return 0; // Default to no sorting
    }
  });

  // Clear the container and append sorted products
  productsContainer.innerHTML = "";
  products.forEach((product) => productsContainer.appendChild(product));
}


