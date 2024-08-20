//importing header
import { loadComponent } from './header.js';
import {allProducts} from './data.js';
//For including header searching
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
     if (globalIconCartSpan) {
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
  }).catch(error => {
    console.error("Error loading component:", error);
  });
});

//Slider Logic
const SliderImages = [
  "../images/img1.png",
  "../images/img2.PNG",
  "../images/img3.PNG",
];
//accessing btns and image
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const ImageChange = document.getElementById("Image");
//making function for updating
let index = 0;
function imageSliderNext() {
  index++;
  if (index === SliderImages.length) {
    //set image to first image
    index = 0;
  }
  ImageChange.src = SliderImages[index];
}
function imageSliderPrev() {
  index--;
  if (index < 0) {
    index = SliderImages.length - 1; //set image to last image
  }
  ImageChange.src = SliderImages[index];
}
nextBtn.onclick = () => {
  imageSliderNext();
};
prevBtn.onclick = () => {
  imageSliderPrev();
};

//Slide Ride Function
function sildeShow(){
  let index = 0; // Start at the first image

  setInterval(() => {
      ImageChange.src = SliderImages[index]; // Change the image source
      index = (index + 1) % SliderImages.length; // Move to the next image, loop back to start
  }, 3000); // Change image every 3 seconds
}
sildeShow();


//Categories sample data
//Six categories 
//Three for Men's Fashion and three For Womens Fashion

document.addEventListener('DOMContentLoaded', () => {
//display subcategories
  const subcategoryContainer = document.getElementById('subcategoryContainer');
  allProducts.forEach(categoryData => {
    categoryData.subcategories.forEach(subcategory => {
      const card = document.createElement('div');
      card.classList.add('subcategory');
      
      // Find the first product in the current subcategory to use its image and name
      const product = categoryData.products.find(p => p.subCategory === subcategory);
      
      if (product) {
        card.innerHTML = `
          <img src="${product.image}" alt="${subcategory}">
          <h3><a href="${subcategory.split(" ").join("")}.html">${subcategory}</a></h3>`;
        subcategoryContainer.appendChild(card);
      }
    });
  });
});



