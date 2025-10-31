import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearFirestoreCart,
  fetchCart,
} from "../redux/cartSlice";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soldItems, setSoldItems] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        dispatch(fetchCart(currentUser.uid));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user || items.length === 0) return;

    const unsubscribes = items.map((item) => {
      const productRef = doc(db, "products", item.id);
      return onSnapshot(productRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.available === false) {
            setSoldItems((prev) => new Set([...prev, item.id]));
          }
        }
      });
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [user, items]);

  const handleRemove = (id) => {
    if (user) {
      dispatch(removeFromCart({ id, userId: user.uid }));
      toast.success('successfully removed the product from the cart')
    }
  };

  const handleClearCart = () => {
    if (user) {
      dispatch(clearFirestoreCart(user.uid));
      toast.success('Cart cleared')
    }
  };

  const handleCheckout = () => {
    const soldInCart = items.filter((item) => soldItems.has(item.id));
    if (soldInCart.length > 0) {
      const names = soldInCart.map((i) => i.name).join(", ");
      toast.error(`Sorry! The following product(s) are already sold:\n\n${names}\n\nPlease remove them from your cart before checking out.`);
      return;
    }
    navigate("/checkout");
  };

  const availableItems = items.filter((item) => !soldItems.has(item.id));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h2 className="text-xl text-gray-500">Loading...</h2>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Please log in
          </h2>
          <p className="text-gray-500">
            Log in to view and manage your cart items.
          </p>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500">Add some products to get started.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6">Your Cart</h1>

          {soldItems.size > 0 && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              <h3 className="font-semibold">Some items are no longer available</h3>
              <p className="text-sm">They are marked below. You can remove them.</p>
            </div>
          )}

          <div className="space-y-6">
            {items.map((item) => {
              const isSold = soldItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-center justify-between border-b pb-4 ${
                    isSold ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {item.name}
                        {isSold && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            SOLD
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-indigo-600 font-semibold mt-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {availableItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Your cart is empty after removing sold items.</p>
              <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
                Continue Shopping
              </Link>
            </div>
          )}

          {availableItems.length > 0 && (
            <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Total: ₹{total.toFixed(2)}
              </h2>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <button
                  onClick={handleClearCart}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow-md"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;