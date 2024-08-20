//Logic for view 
function setDisplay(columns) {
    const container = document.getElementById('productContainer');
    container.className = 'products'; // Reset class name
  
    if (columns === 2) {
        container.classList.add('columns-2');
    } else if (columns === 3) {
        container.classList.add('columns-3');
    }
  }