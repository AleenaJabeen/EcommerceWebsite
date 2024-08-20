import { loadComponent } from "./header.js";
import { allProducts } from "./data.js";


const cart=(JSON.parse(localStorage.getItem("cart")));
if (!Array.isArray(cart)) {
  console.error('cart is not an array:', cart);
}
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
        updateCartIconSpan();
      } else {
        console.error("Icon cart span element not found.");
      }

      // Access the cart icon
      const cartIcon = document.querySelector(".icon-cart");
      if (cartIcon) {
        cartIcon.addEventListener("click", () => {
          window.location.href = "/html/ShoppingCart.html";
        });
      } else {
        console.error("Cart icon element not found.");
      }
    })
    .catch((error) => {
      console.error("Error loading component:", error);
    });
});
//subtotal calculation
const subTotalElement=document.querySelector(".amount");
const calculateSubtotal = () => {
  let subtotal = 0;

  if (cart.length > 0) {
        cart.forEach((item) => {
      const product = products.find((value) => value.id == item.product_id);
      if (product) {
        let priceString = product.price.split("Rs. ")[1];
        priceString = priceString.replace(/,/g, "");
        const priceNumber = parseFloat(priceString);
        subtotal += priceNumber * item.quantity;
      
      }
    });
  }

  return subtotal;
};
//For displaying cart list
const cartList = document.querySelector(".cart-items");
const addCartToHTML = () => {
  
  cartList.innerHTML = "";
  
  if (cart.length > 0) {
    cart.forEach((item,index) => {
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;
    let quantity=item.quantity;
      let info = products.find((value) => value.id == item.product_id);
      let priceString = info.price.split("Rs. ")[1];
      priceString = priceString.replace(/,/g, "");
      const priceNumber = parseFloat(priceString);
      let totalPrice = priceNumber * quantity;
      cartList.appendChild(newItem);
      newItem.innerHTML = `
           <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="productImg"><img src="${info.image}" alt=${info.name}><div class="allDetails"><span class="details"><h4>${info.name}</h4><i class="fa-solid fa-trash-can delete"></i></span></td>
       <td class="price">${info.price}</td>
        <td class="quantities"><span class="minus">-</span><span class="quantity">${quantity}</span><span class="plus">+</span></td>
        <td class="totalPrice">Rs. ${totalPrice}</td></div>
      </tr>
    </tbody>
  </table>
            `;
            //delete item from cart
            newItem.querySelector('.delete').addEventListener('click', function () {
              cart.splice(index, 1); // Remove the item from the cart array
              newItem.remove();
              localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
              updateSubtotal();
              updateCartIconSpan(); 
              // Remove the item from the cart array
              });
            // Handle quantity changes
    const quantityElement = newItem.querySelector(".quantity");
const newTotalPrice=newItem.querySelector(".totalPrice");
    newItem.querySelector(".plus").addEventListener("click", function () {
      quantity++;
      quantityElement.textContent = quantity;
      totalPrice = priceNumber * quantity;
      newTotalPrice.textContent = "Rs. " +  totalPrice;
      item.quantity = quantity;  // Update the quantity in cart array
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartIconSpan(); // Save updated cart
      updateSubtotal(); // Recalculate subtotal// Save updated cart
    });
    newItem.querySelector(".minus").addEventListener("click", function () {
      if (quantity >= 1) {
        quantity--;
        quantityElement.textContent = quantity;
        totalPrice = priceNumber * quantity;
        newTotalPrice.textContent = "Rs. " +  totalPrice;
        item.quantity = quantity;  // Update the quantity in cart array
        localStorage.setItem("cart", JSON.stringify(cart)); 
        updateCartIconSpan();// Save updated cart
        updateSubtotal(); // Recalculate subtotal// Save updated cart

      }
    });

    });
   
  }
  updateSubtotal();
};
const updateSubtotal = () => {
  const subtotal = calculateSubtotal();
  subTotalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;
};
addCartToHTML();
const updateCartIconSpan = () => {
  if (!globalIconCartSpan) return; // Exit if the element is not found

  let totalQuantity = 0;

  if (cart && cart.length > 0) {
    cart.forEach(item => {
      totalQuantity += item.quantity; // Sum up quantities of all items
    });
  }

  globalIconCartSpan.textContent = totalQuantity; // Update the cart icon span
};





