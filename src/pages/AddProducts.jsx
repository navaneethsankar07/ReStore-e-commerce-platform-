import { useForm } from "react-hook-form";
import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function AddProduct() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.currentUser);
  console.log(user);
  
    const navigate = useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", data.photo[0]);
      formData.append("upload_preset", "product_upload"); 
      const cloudName = "dhirmfykj"; // 

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const fileData = await res.json();
      if (!fileData.secure_url) throw new Error("Image upload failed");

      const imageUrl = fileData.secure_url;

      await addDoc(collection(db, "products"), {
        name: data.name,
        price:parseInt( data.price),
        description: data.description,
        imageUrl,
        userId: user.userId,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully!");
      reset();
      setImagePreview(null);
      navigate('/myproduct')
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-white to-purple-100 px-4 py-10">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Wooden Chair"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("name", { required: "Product name is required" })}
              />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              placeholder="25.99"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
              />
            {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows="4"
              placeholder="Describe your product..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              {...register("description", { required: "Description is required" })}
              ></textarea>
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Product Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              {...register("photo", { required: "Please upload a photo" })}
              onChange={handleImageChange}
            />
            {errors.photo && <p className="text-red-600 text-sm">{errors.photo.message}</p>}
            {imagePreview && (
              <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg mt-3 border border-gray-200"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-lg transition ${
              loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
            </>
  );
}
