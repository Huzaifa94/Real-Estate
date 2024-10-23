import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signInSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
export default function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileUploadError(true);
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data.user, "dataaaaaaaaaaaaaa");

      if (data.success === false) {
        console.log("okkkkkkkkk");

        dispatch(updateUserFailure(data.message));
        return;
      } else {
        dispatch(updateUserSuccess(data.user));
        setUpdateSuccess(true);
        console.log(data.user);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data.message));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const hanldeSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }

      dispatch(signInSuccess(null));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data);
      
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true, error);
    }
  };
const handleListingDelete = async(listingId) => {

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{

        method: 'DELETE',
      })
      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
        
      } 
  
      setUserListings((prev)=>prev.filter((listing)=>listing.id !==listingId));
    } catch (error) {
      console.log(error);
      
    }
  } 
   return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">
              Images successfully uploaded!
            </span>
          ) : null}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 rounded-lg p-3 text-center font-semibold text-white uppercase hover:opacity-95"
          to={"/create-Listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={hanldeSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "Updated Successfully" : ""}
      </p>
      <button onClick={handleShowListings} className=" text-green-600 w-full">
        Show listings
      </button>
      <p className=" text-red-600 mt-4">
        {showListingsError ? "Error Showing Listings" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) =>(
          <div key={listing._id} className=" border rounded-lg border-gray-400 flex justify-between items-center p-3">
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link to={`listing/${listing._id}`}>
            
            <p className="text-slate-700">{listing.name}</p>
            </Link>
          <div className=" flex flex-col items-center">
            <button onClick={()=>handleListingDelete(listing._id)} className="text-red-600 uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
            <button className="text-green-600 uppercase">edit</button>
            </Link>
          </div>
          </div>
        ))}
    </div>
  );
}
