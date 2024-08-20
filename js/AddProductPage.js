import { allProducts } from "./data.js";
import { loadComponent } from "./header.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  console.log(productId);

  if (!isNaN(productId)) {
    // Find the product
    let product;
    for (const category of allProducts) {
      product = category.products.find((p) => p.id === productId);
      if (product) break;
    }

    const productDetail = document.getElementById("product-detail");
    if (productDetail) {
      if (product) {
        productDetail.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h1>${product.name}</h1>
            <p>${product.description}</p>
            <p>Price: ${product.price}</p>
            <span class="product-size">Size: XS</span>
            <div class="product-size-options">
              <span class="size-option onclick" data-size="XS">XS</span>
              <span class="size-option" data-size="S">S</span>
              <span class="size-option" data-size="M">M</span>
              <span class="size-option" data-size="L">L</span>
              <span class="size-option" data-size="XL">XL</span>
            </div>
            <div class="product-quantity">
              <span class="minus" data-id="${product.id}">-</span>
              <span class="quantity">1</span>
              <span class="plus" data-id="${product.id}">+</span>
            </div>
            <button data-id=${product.id} class="addCart">Add to Cart</button>
          </div>
        `;

        // Event listener for size options
        const productSizeDisplay = productDetail.querySelector(".product-size");
        const sizeOptions = productDetail.querySelectorAll(".size-option");

        sizeOptions.forEach(option => {
          option.addEventListener("click", function () {
            sizeOptions.forEach(opt => opt.classList.remove("onclick"));
            this.classList.add("onclick");
            productSizeDisplay.innerText = `Size: ${this.dataset.size}`;
          });
        });

        // Handle quantity changes
        const quantityElement = productDetail.querySelector(".quantity");
        let quantity = parseInt(quantityElement.textContent);

        productDetail.querySelector(".plus").addEventListener("click", function () {
          quantity++;
          quantityElement.textContent = quantity;
        });

        productDetail.querySelector(".minus").addEventListener("click", function () {
          if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
          }
        });

        // Handle add to cart
        productDetail.querySelector(".addCart").addEventListener("click", function () {
          const id_product = this.dataset.id;
          addToCart(id_product, quantity);
          document.body.classList.toggle("showCart");
        });
      } else {
        productDetail.innerHTML = "<p>Product not found.</p>";
      }
    } else {
      console.error('Element with id "product-detail" not found.');
    }
  } else {
    console.error("Invalid product ID.");
  }
});

// For including header and searching
let globalIconCartSpan;
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("/html/header.html", "header")
    .then(() => {
      const searchButton = document.getElementById("searchButton");
      if (searchButton) {
        searchButton.addEventListener("click", () => {
          const searchTerm = document.getElementById("searchInput").value;
          if (searchTerm) {
            window.location.href = `SearchProductPage.html?query=${encodeURIComponent(
              searchTerm
            )}`;
          }
        });
      }
      loadComponent("/html/footer.html", "footer");

      // Accessing iconCartSpan
      globalIconCartSpan = document.getElementById("Span");
      if (globalIconCartSpan) {
        console.log(globalIconCartSpan.innerHTML);
      } else {
        console.error("Icon cart span element not found.");
      }

      // Access the cart icon
      const cartIcon = document.querySelector(".icon-cart");
      if (cartIcon) {
        cartIcon.addEventListener("click", () => {
          window.location.href = "/html/Cart.html";
        });
      } else {
        console.error("Cart icon element not found.");
      }
    })
    .catch((error) => {
      console.error("Error loading component:", error);
    });
});

// Add To Cart Logic

let cart = [];
const body = document.body;

// Add to Cart Function
const addToCart = (product_id, quantity) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length < 0) {
    cart = [
      {
        product_id: product_id,
        quantity: quantity,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: quantity,
    });
  } else {
    cart[positionThisProductInCart].quantity += quantity;
  }
  addCartToHTML();
  addCartToMemory();
};

// For saving products in memory
const addCartToMemory = function () {
  if (!Array.isArray(cart)) {
    console.error("cart is not an array:", cart);
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};
// To show products in cart
let listCartHTML = document.querySelector(".listCart");

// For getting products from data file
const getAllProducts = () => {
  return allProducts.flatMap((category) =>
    category.products.map((product) => ({
      ...product,
      category: category.category,
      subCategory: product.subCategory,
    }))
  );
};
const products = getAllProducts();

// For showing product on sidebar cart menu
const addCartToHTML = function () {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
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

// Change quantity on Cart

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
const closeCart = document.querySelector(".close");
closeCart.addEventListener("click", () => {
  console.log("clicked");
  document.body.classList.toggle("showCart");
});
