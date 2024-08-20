import { allProducts } from './data.js';
import { loadComponent } from './header.js';

let globalIconCartSpan;
let cart = [];

// Consolidate DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', () => {
  // Load header and footer components
  loadComponent("/html/header.html", "header")
    .then(() => {
      // Initialize cart functionality
  globalIconCartSpan = document.getElementById("Span");
      // Search functionality
      handleSearchQuery();

      // Initialize cart icon functionality
      initializeCartIcon();

      // Handle close cart sidebar
      initializeCartSidebar();
    })
    .catch(error => {
      console.error("Error loading header component:", error);
    });

  // Load footer component
  loadComponent("/html/footer.html", "footer")
    .catch(error => {
      console.error("Error loading footer component:", error);
    });

  addCartToHTML(); // Initialize the cart display
});
const listCartHTML = document.querySelector(".listCart");

// Handle search query from URL
function handleSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = urlParams.get('query');

  if (searchTerm) {
    const searchResults = searchProducts(searchTerm);
    const searchResultsContainer = document.getElementById('searchResults');
    if (searchResultsContainer) {
      displaySearchResults(searchResultsContainer, searchResults);
    } else {
      console.error("Search results container not found.");
    }
  }
}

// Search products by name or description
function searchProducts(searchTerm) {
  const results = [];
  allProducts.forEach(category => {
    category.products.forEach(product => {
      const productName = product.name.toLowerCase();
      const productDescription = product.description.toLowerCase();
      if (productName.includes(searchTerm.toLowerCase()) || productDescription.includes(searchTerm.toLowerCase())) {
        results.push(product);
      }
    });
  });
  return results;
}

// Display search results
function displaySearchResults(container, results) {
  container.innerHTML = ''; // Clear previous results

  if (results.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  results.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product-item';

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <button data-id="${product.id}" class="addCart">Add To Cart</button>
    `;

    container.appendChild(productElement);
  });

  container.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("addCart")) {
      document.body.classList.toggle("showCart");
      let id_product = positionClick.dataset.id;
      addToCart(id_product);
    }
  });
}

// Initialize cart icon and sidebar
function initializeCartIcon() {
  const cartIcon = document.querySelector(".icon-cart");
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "/html/Cart.html";
    });
  } else {
    console.error("Cart icon element not found.");
  }
}

// Handle close cart sidebar
function initializeCartSidebar() {
  const closeCart = document.querySelector('.close');
  if (closeCart) {
    closeCart.addEventListener('click', () => {
      document.body.classList.toggle('showCart');
    });
  } else {
    console.error("Close cart button not found.");
  }
}

// Cart management functions
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [{ product_id: product_id, quantity: 1 }];
  } else if (positionThisProductInCart < 0) {
    cart.push({ product_id: product_id, quantity: 1 });
  } else {
    cart[positionThisProductInCart].quantity += 1;
  }
  addCartToHTML();
  addCartToMemory();
};

const addCartToMemory = () => {
  if (!Array.isArray(cart)) {
    console.error('Cart is not an array:', cart);
    return;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let info = products.find((value) => value.id == item.product_id);
      if (info) {
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
            </div>`;
        listCartHTML.appendChild(newItem);
      }
    });
  }
  if (globalIconCartSpan) {
    globalIconCartSpan.innerText = totalQuantity;
  }
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

// Get the product list
const getAllProducts = () => {
  return allProducts.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      category: category.category,
      subCategory: product.subCategory,
    }))
  );
};

// Get the products for the cart
const products = getAllProducts();

