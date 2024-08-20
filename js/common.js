// displayProducts using category and subcategory
import { displayProducts} from './AllFunctions.js';
//Filter product on bases of price and alphabets
import { sortProducts } from './AllFunctions.js';
//for including header
import { loadComponent } from './header.js';
//importing data for category or subcategory check
import { allProducts } from './data.js';
//Category 
//Saving in memory
import {cart} from './AllFunctions.js'


export const addCartToMemory = () => {
  if (!Array.isArray(cart)) {
    console.error('cart is not an array:', cart);
    return;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
};
function determineCategoryAndSubcategory() {
  const headingElement = document.getElementById('categoryOrSubcategory');
  const categoryOrSubcategory = headingElement.textContent.trim();
  let category = null;
  let subcategory = null;

  // Loop through categories to determine if it's a category or subcategory
  for (const categoryData of allProducts) {
      if (categoryData.category === categoryOrSubcategory) {
          category = categoryOrSubcategory;
          break;
      } else if (categoryData.subcategories.includes(categoryOrSubcategory)) {
          category = categoryData.category;
          subcategory = categoryOrSubcategory;
          break;
      }
  }
  if (category) {
    displayProducts(category, subcategory);
} else {
    document.write('Unknown category or subcategory:', categoryOrSubcategory);
}
}

determineCategoryAndSubcategory();

document.getElementById('sortOptions').addEventListener('change', function() {
    sortProducts(this.value);
  });
//For including header and searching 
let globalIconCartSpan;
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("/html/header.html", "header").then(() => {
    const searchButton = document.getElementById("searchButton");
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        const searchTerm = document.getElementById("searchInput").value;
        if (searchTerm) {
          window.location.href = `SearchProductPage.html?query=${encodeURIComponent(searchTerm)}`;
        }
      });
    }
    loadComponent("/html/footer.html", "footer");

    
    // Accessing iconCartSpan
     // Access the iconCartSpan and assign it to the global variable
     globalIconCartSpan = document.getElementById("Span");
    
    // Access the cart icon
    const cartIcon = document.querySelector(".icon-cart");
    if (cartIcon) {
      cartIcon.addEventListener("click", () => {
        window.location.href = "/html/Cart.html";
      });
    } else {
      console.error("Cart icon element not found.");
    }
  }).catch(error => {
    console.error("Error loading component:", error);
  });
});


//Cart 
let listCartHTML = document.querySelector(".listCart");
const getAllProducts = () => {
  return allProducts.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      category: category.category,
      subCategory: product.subCategory,
    }))
  );
};

// Get the product list
const products = getAllProducts();

export const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity = totalQuantity + item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let info = products.find((value) => value.id == item.product_id);
      listCartHTML.appendChild(newItem);
      newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">
                ${info.name}
            </div>
            <div class="totalPrice">${info.price} x ${item.quantity}</div>
            <div class="quantity">
                <span class="minus" data-id="${info.id}">-</span>
                <span>${item.quantity}</span>
                <span class="plus" data-id="${info.id}">+</span>
            </div>
            `;
    });
  }
  globalIconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.dataset.id;
    let type = positionClick.classList.contains("plus") ? "plus" : "minus";
    changeQuantityCart(product_id, type);
  }
});

//Change quantity on Cart icon
export const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity += 1;
        break;
      case "minus":
        if (cart[positionItemInCart].quantity > 1) {
          cart[positionItemInCart].quantity -= 1;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};
//for closing the cart sidebar
const closeCart=document.querySelector('.close');
closeCart.addEventListener('click', () =>{
document.body.classList.toggle('showCart')});





