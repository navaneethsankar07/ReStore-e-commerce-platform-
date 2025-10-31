import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { setProducts, removeProduct, updateProduct } from "../redux/productSlice";
import Navbar from "../components/Navbar";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function Sell() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const q = query(collection(db, "products"), where("userId", "==", currentUser.uid));
          const snap = await getDocs(q);
          const list = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              ...data,
              createdAt: data.createdAt?.toDate().toISOString() || null,
            };
          });
          dispatch(setProducts(list));
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleDelete = async (id, isSold) => {
    if (isSold) return;
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      dispatch(removeProduct(id));
      toast.success('Product Removed')
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (p) => {
    if (p.available === false) return;
    setEditingProduct(p);
    setFormData({ name: p.name, price: p.price, description: p.description });
    setImagePreview(p.imageUrl);
    setImageFile(null);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setUploading(true);
    try {
      let imgUrl = editingProduct.imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        fd.append("upload_preset", "product_upload");
        const res = await fetch(`https://api.cloudinary.com/v1_1/dhirmfykj/image/upload`, { method: "POST", body: fd });
        const json = await res.json();
        if (!json.secure_url) throw new Error("Upload failed");
        imgUrl = json.secure_url;
      }
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        imageUrl: imgUrl,
      };
      await updateDoc(doc(db, "products", editingProduct.id), payload);
      dispatch(updateProduct({ id: editingProduct.id, ...payload }));
      closeEditModal();
    } catch (e) {
      console.error(e);
      toast.error("Update failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-20">Loading products...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 && (
            <div className="text-center py-20">
              <svg className="mx-auto w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No products yet</h3>
              <p className="mt-2 text-gray-600">
                {user ? "Be the first to sell something!" : "Sign up to start selling."}
              </p>
              {user && (
                <Link to="/addProduct"
                  className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  Add Your First Product
                </Link>
              )}
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const isSold = p.available === false;
              return (
                <div key={p.id}
                  className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${isSold ? "opacity-75" : "border-gray-100"}`}>
                  <div className="relative overflow-hidden">
                    <img src={p.imageUrl} alt={p.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                    {isSold && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold tracking-wider">SOLD</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{p.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                        ₹{Number(p.price).toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(p)} disabled={isSold}
                          className={`p-2 rounded-lg transition-colors ${isSold ? "text-gray-400 cursor-not-allowed" : "text-indigo-600 hover:bg-indigo-50"}`}
                          title={isSold ? "Cannot edit sold product" : "Edit"}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(p.id, isSold)} disabled={isSold}
                          className={`p-2 rounded-lg transition-colors ${isSold ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:bg-red-50"}`}
                          title={isSold ? "Cannot delete sold product" : "Delete"}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v2M9 5h6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" step="0.01" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                        <img src={imagePreview} alt="preview" className="w-full h-48 object-cover" />
                        <button type="button" onClick={triggerFileInput}
                          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {imageFile ? "New" : "Current"}
                        </p>
                      </div>
                    ) : (
                      <div onClick={triggerFileInput}
                        className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={uploading}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${uploading ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg"}`}>
                    {uploading ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" onClick={closeEditModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-xl font-medium hover:bg-gray-300 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}