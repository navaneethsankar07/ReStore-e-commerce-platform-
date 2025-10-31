import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { setProducts } from "../redux/productSlice";
import { addToCart, fetchCart } from "../redux/cartSlice";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart || { items: [] });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => {
          const product = doc.data();
          if (product.createdAt?.toDate) {
            product.createdAt = product.createdAt.toDate().toISOString();
          }
          return { id: doc.id, ...product };
        });
        dispatch(setProducts(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.uid));
    }
  }, [user, dispatch]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      toast.warn("Please log in to add items to cart");
      return;
    }
dispatch(addToCart({ product, userId: user.uid }));
    toast.success(`${product.name} added to cart!`);
  };

const filteredProducts = products
  .filter((p) => p.available !== false)       
  .filter((p) => !user || p.userId !== user.uid); 
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {user ? "Explore Amazing Products" : "Welcome to ReStore"}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Discover handmade, unique items from creators like you.
            </p>
          </div>
           {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No products available.
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const isInCart = cartItems.some(
                (cartItem) => cartItem.id === product.id
              );

              return (
                <div
                  key={product.id}
                  className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-white/20"
                >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-6">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>

                  <div className="px-5 pb-5">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isInCart}
                      className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        isInCart
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {isInCart ? "Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
