document.addEventListener('DOMContentLoaded', () => { 
  // Shop Elements
  const products = document.querySelectorAll('.product'); 
  const toast = document.getElementById('toast'); 
  const cartCountSpan = document.getElementById('cartCount'); 
  const navCartBadge = document.getElementById('navCartBadge'); 
  const globalCheckoutBtn = document.getElementById('globalCheckoutBtn'); 
  
  // Lightbox Popup Elements (matching your exact HTML IDs)
  const popup = document.getElementById('popup'); 
  const popupImg = document.getElementById('popup-img'); 
  const popupCaption = document.getElementById('popup-caption'); 
  const closeBtn = document.getElementById('close-btn'); 
  
  let globalCart = []; 

  function showToast(message) { 
    toast.textContent = message; 
    toast.className = 'toast show'; 
    setTimeout(() => { toast.className = 'toast'; }, 2000); 
  } 

  function updateGlobalCheckoutBar() { 
    const totalItemsInCart = globalCart.reduce((acc, item) => acc + item.qty, 0); 
    cartCountSpan.textContent = totalItemsInCart; 
    navCartBadge.textContent = totalItemsInCart; 
    globalCheckoutBtn.disabled = totalItemsInCart === 0; 
  } 

  products.forEach(product => { 
    const name = product.getAttribute('data-name'); 
    const unitPrice = parseFloat(product.getAttribute('data-price')); 
    const decreaseBtn = product.querySelector('.decreaseBtn'); 
    const increaseBtn = product.querySelector('.increaseBtn'); 
    const quantitySpan = product.querySelector('.quantity'); 
    const totalPriceSpan = product.querySelector('.totalPrice'); 
    const addToCartBtn = product.querySelector('.addToCartBtn'); 
    const productImg = product.querySelector('.product-img'); 
    let currentQty = 0; 

    // Open Lightbox Popup with Image and Caption text when clicked
    if (productImg) {
      productImg.addEventListener('click', () => {
        if (popup && popupImg) {
          popupImg.src = productImg.src;
          popupImg.alt = name;
          if (popupCaption) {
            // Displays the product text description below the zoom frame image
            popupCaption.textContent = name;
          }
          popup.style.display = 'flex';
        }
      });
    }

    // Increase Quantity
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => { 
        currentQty++; 
        quantitySpan.textContent = currentQty; 
        totalPriceSpan.textContent = (currentQty * unitPrice).toLocaleString('en-PH', {minimumFractionDigits: 2});
      });
    }

    // Decrease Quantity
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => { 
        if (currentQty > 0) {
          currentQty--; 
          quantitySpan.textContent = currentQty; 
          totalPriceSpan.textContent = (currentQty * unitPrice).toLocaleString('en-PH', {minimumFractionDigits: 2});
        }
      });
    }

    // Add To Cart logic
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        if (currentQty === 0) {
          showToast('Please select a quantity first.');
          return;
        }
        
        const existingProduct = globalCart.find(item => item.name === name);
        if (existingProduct) {
          existingProduct.qty += currentQty;
          existingProduct.total = existingProduct.qty * unitPrice; 
        } else {
          globalCart.push({ 
            name: name, 
            qty: currentQty, 
            price: unitPrice,
            total: currentQty * unitPrice 
          });
        }
        
        showToast(`${currentQty} x ${name} added to cart!`);
        currentQty = 0; 
        quantitySpan.textContent = currentQty;
        totalPriceSpan.textContent = '0.00';
        updateGlobalCheckoutBar();
      });
    }
  });

  // Proceed to Payment Action URL Redirection Handler
  if (globalCheckoutBtn) {
    globalCheckoutBtn.addEventListener('click', () => {
      if (globalCart.length === 0) return;
      
      const cartDataString = encodeURIComponent(JSON.stringify(globalCart));
      window.location.href = `checkout.html?cart=${cartDataString}`;
    });
  }

  // Close the popup when the close button is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }

  // Close the popup if the user clicks the dark background space outside the content box
  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    });
  }
});