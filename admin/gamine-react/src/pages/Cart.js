import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingCost, setShippingCost] = useState(30000); // 30,000 VND shipping fee
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, loading, success, error

  // Simulated user info
  const [user, setUser] = useState({
    user_id: 1,
    username: 'user1',
    email: 'user1@example.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận XYZ, Thành phố HCM'
  });

  // Fetch cart items from database (simulated)
  useEffect(() => {
    // In a real app, this would fetch from the Cart table for the current user_id
    const fetchCartItems = async () => {
      // Simulated API response
      const cartData = [
        {
          cart_id: 1,
          user_id: 1,
          product_id: 1,
          quantity: 1,
          product: {
            product_id: 1,
            name: "Quantum Keyboard",
            description: "Mechanical RGB gaming keyboard with custom switches",
            price: 3500000,
            stock_quantity: 20,
            category_id: 1,
            images: [
              { image_id: 1, image_url: "/assets/images/keyboard.png", is_primary: true }
            ]
          }
        },
        {
          cart_id: 2,
          user_id: 1,
          product_id: 3,
          quantity: 2,
          product: {
            product_id: 3,
            name: "Sonic Headset",
            description: "Immersive gaming headset with 7.1 surround sound",
            price: 2800000,
            stock_quantity: 12,
            category_id: 3,
            images: [
              { image_id: 3, image_url: "/assets/images/Headsets.png", is_primary: true }
            ]
          }
        }
      ];
      
      setCartItems(cartData);
      calculateTotals(cartData);
    };

    fetchCartItems();
  }, []);

  // Calculate total price whenever cart items change
  const calculateTotals = (items) => {
    const total = items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    setTotalPrice(total);
  };

  // Handle quantity changes
  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      if (item.cart_id === cartId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    calculateTotals(updatedItems);
  };

  // Remove item from cart
  const handleRemoveItem = (cartId) => {
    const updatedItems = cartItems.filter(item => item.cart_id !== cartId);
    setCartItems(updatedItems);
    calculateTotals(updatedItems);
  };

  // Apply promo code
  const handleApplyPromo = () => {
    // In a real app, this would verify the promo code against the Promotions table
    if (promoCode === 'CYBER20') {
      const discount = totalPrice * 0.2; // 20% discount
      setDiscountAmount(discount);
    } else {
      setDiscountAmount(0);
      alert('Invalid promo code');
    }
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate final price
  const finalPrice = totalPrice + shippingCost - discountAmount;

  // Handle checkout process
  const handleCheckout = async () => {
    try {
      setOrderStatus('loading');
      
      // In a real app, this would create records in the Orders, OrderDetails, and Payments tables
      const orderData = {
        user_id: user.user_id,
        total_amount: finalPrice,
        order_status: 'Pending',
        order_details: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price
        })),
        payment: {
          payment_method: paymentMethod,
          payment_status: 'Pending',
          transaction_id: `TXN${Date.now()}`
        }
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Order created:', orderData);
      setOrderStatus('success');
      
      // Clear cart after successful order
      // In a real app, this would update the Cart table records with the new order_id
      setTimeout(() => {
        setCartItems([]);
        setTotalPrice(0);
        setDiscountAmount(0);
      }, 2000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderStatus('error');
    }
  };

  return (
    <div className="page-container">
      <div className="cart-page">
        {/* Cyberpunk decorative elements */}
        <div className="cyber-circuit top"></div>
        <div className="cyber-circuit bottom"></div>
        <div className="cyber-dot dot1"></div>
        <div className="cyber-dot dot2"></div>
        
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img src="/assets/icons/empty-cart.png" alt="Empty Cart" />
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <Link to="/products" className="cta-button">Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                <div className="cart-header">
                  <div className="cart-product">Product</div>
                  <div className="cart-price">Price</div>
                  <div className="cart-quantity">Quantity</div>
                  <div className="cart-total">Total</div>
                  <div className="cart-actions">Actions</div>
                </div>
                
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.cart_id}>
                    <div className="cart-product">
                      <img 
                        src={item.product.images.find(img => img.is_primary)?.image_url || item.product.images[0]?.image_url} 
                        alt={item.product.name} 
                      />
                      <div>
                        <h3>{item.product.name}</h3>
                        <p>{item.product.description.substring(0, 60)}...</p>
                      </div>
                    </div>
                    <div className="cart-price">{formatPrice(item.product.price)}</div>
                    <div className="cart-quantity">
                      <button 
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock_quantity}
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-total">{formatPrice(item.product.price * item.quantity)}</div>
                    <div className="cart-actions">
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveItem(item.cart_id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <h2>Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="promo-code">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo}>Apply</button>
                </div>
                
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatPrice(finalPrice)}</span>
                </div>
                
                <div className="payment-methods">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                      />
                      <span>Credit Card</span>
                    </label>
                    
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                      />
                      <span>Bank Transfer</span>
                    </label>
                  </div>
                </div>
                
                <div className="shipping-address">
                  <h3>Shipping Address</h3>
                  <p>{user.username}</p>
                  <p>{user.phone}</p>
                  <p>{user.address}</p>
                  <button className="edit-address">Edit Address</button>
                </div>
                
                <button 
                  className={`checkout-button ${orderStatus === 'loading' ? 'loading' : ''}`}
                  onClick={handleCheckout}
                  disabled={orderStatus === 'loading' || orderStatus === 'success'}
                >
                  {orderStatus === 'loading' ? 'Processing...' : 
                   orderStatus === 'success' ? 'Order Placed!' : 'Checkout'}
                </button>
                
                {orderStatus === 'error' && (
                  <div className="error-message">
                    There was an error processing your order. Please try again.
                  </div>
                )}
                
                <Link to="/products" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;