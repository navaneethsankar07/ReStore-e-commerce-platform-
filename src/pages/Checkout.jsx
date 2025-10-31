import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { clearFirestoreCart } from "../redux/cartSlice";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Checkout() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { items } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.auth);
  const user = currentUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      if (items.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      for (const item of items) {
        const productRef = doc(db, "products", item.id);
        const snap = await getDoc(productRef);
        if (!snap.exists()) {
          throw new Error(`${item.name} is no longer available`);
        }
      }

      const orderData = {
        userId: user.userId,
        items,
        address: data.address.trim(),
        phone: data.phone,
        name: data.name.trim(),
        payment: "Cash on Delivery",
        createdAt: new Date(),
        status: "Order Placed",
      };

      for (const item of items) {
        const productRef = doc(db, "products", item.id);
        await updateDoc(productRef, { available: false });
      }

      await dispatch(clearFirestoreCart(user.userId)).unwrap();

      setOrderPlaced(true);
      reset();
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error.message || "Something went wrong during checkout!");
    }
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-green-600">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mt-2">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-indigo-600">
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            {...register("name", {
              required: "Name is required",
              validate: (value) =>
                value.trim() !== "" || "Name cannot be empty or spaces only",
            })}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit number",
              },
            })}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Phone Number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <textarea
            {...register("address", {
              required: "Address is required",
              validate: ((value) => {
    const trimmed = value.trim();
    if (trimmed === "") return "Address cannot be empty or spaces only";
    if (trimmed.length < 5) return "Address must be at least 5 characters long";
    return true;
              })
            })}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Your Delivery Address"
            rows={3}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-6">
          <p className="font-semibold text-lg">
            Payment Method:{" "}
            <span className="text-green-600">Cash on Delivery</span>
          </p>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
