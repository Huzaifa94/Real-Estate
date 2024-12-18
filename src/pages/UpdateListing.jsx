import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLaoding] = useState(false);
  const [uploading, setUplaoding] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  useEffect(()=>{
    const fetchListing = async ()=>{

        const listingId = params.listingId;
        console.log(listingId);
        
        const res = await fetch(`/api/listing/get/${listingId}`)

        const data = await res.json();
        console.log(data);
        
       
        if(data.success === false){
           
            return;
            
        }
        setFormData(data)
    }
    fetchListing();
  },[]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUplaoding(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImageUploadError(false);
          setUplaoding(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload error (2mb max per image)", error);
          setUplaoding(false);
        });
    } else {
      setImageUploadError("You can uplaod 6 images per Listing");
      setUplaoding(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}%done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURl) => {
            resolve(downloadURl);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
       
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.regularPrice < formData.discountPrice)
        return setError("Discount cannot be more then regular Price ");
      if (formData.imageUrls.length < 1)
        return setError("You must uplaod one Image");
      setLaoding(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLaoding(false);
      if (data.success === false) {
        setError(data.message);
        
      }
      navigate(`/listing/${data._id}`);
      console.log(data);
    } catch (error) {
      setError(error.message);
      setLaoding(false);
    }
    console.log(formData);
  };
  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6">
        Update a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row center gap-4"
      >
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Descripton"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required   
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap font-semibold">
            <div className="flex gap-2">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sell</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span>Rent</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking Spot</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className=" w-5"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className=" flex flex-wrap gap-6">
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className=" p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  className=" p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="100"
                  required
                  className=" p-3 border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className=" flex flex-col items-center">
                  <p>Regular Price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className=" flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    min="1"
                    max="1000"
                    required
                    className=" p-3 border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className=" flex flex-col items-center">
                    <p>Discounted Price</p>
                    <span className="text-xs">($/month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-3">
          <p className=" font-semibold">
            Images:
            <span className="font-normal text-gray-800 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className=" flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray- rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 uppercase rounded hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading.." : "upload"}
            </button>
          </div>                           
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className=" flex justify-between items-center p-3 border border-gray-500"
              >
                <img
                  src={url}
                  alt="Listing Image"
                  className="w-40 h-40 object-cover p-3 "
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}

          <button disabled={loading || uploading} className="p-3 bg-slate-700 rounded-lg text-white uppercase font-bold hover:opacity-95 disabled:opacity-80">
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className=" text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
