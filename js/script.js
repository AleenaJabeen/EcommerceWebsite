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
          window.location.href = `/html/SearchProductPage.html?query=${encodeURIComponent(searchTerm)}`;
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

// Define images for desktop and mobile
const SliderImagesDesktop = [
  "/images/desktop-img1.webp",
  "/images/desktop-img2.png",
  "/images/desktop-img3.PNG",
];
const SliderImagesMobile = [
  "/images/mobile-img1.webp",
  "/images/mobile-img2.webp",
  "/images/mobile-img3.webp",
];

// Access buttons and image element
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const ImageChange = document.getElementById("Image");

// Variable to store current image set and index
let SliderImages = [];
let index = 0;

// Function to determine which images to use based on screen size
function updateSliderImages() {
  if (window.innerWidth <= 600) {
    SliderImages = SliderImagesMobile;
  } else {
    SliderImages = SliderImagesDesktop;
  }
  index = 0; // Reset index to show the first image
  ImageChange.src = SliderImages[index]; // Display the first image of the selected set
}

// Update images on initial load
updateSliderImages();

// Update images on window resize
window.addEventListener("resize", updateSliderImages);

// Slider logic
function imageSliderNext() {
  index = (index + 1) % SliderImages.length;
  ImageChange.src = SliderImages[index];
}

function imageSliderPrev() {
  index = (index - 1 + SliderImages.length) % SliderImages.length;
  ImageChange.src = SliderImages[index];
}

nextBtn.onclick = () => {
  imageSliderNext();
};
prevBtn.onclick = () => {
  imageSliderPrev();
};

// Slideshow function
function slideShow() {
  setInterval(() => {
    imageSliderNext();
  }, 3000);
}

slideShow();


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
          <h3><a href="html/${subcategory.split(" ").join("")}.html">${subcategory}</a></h3>`;
        subcategoryContainer.appendChild(card);
      }
    });
  });
});



