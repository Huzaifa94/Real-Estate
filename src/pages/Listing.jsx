import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Contact from "../Contact";

import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import "swiper/css/bundle";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();
  console.log(currentUser._id, listing.userRef);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setIsLoading(false);
          return;
        }

        setListing(data);

        setError(false);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError(true);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {isLoading && <p className="text-center my-7 text-2xl ">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl ">Error loading listing...</p>
      )}
      {listing && !isLoading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className=" text-slate-800">
              <span className=" font-bold text-black ">
                Description - {"  "}
              </span>
              {listing.description}
            </p>
            <ul className=" flex flex-wrap text-sm gap-4">
              <li className=" flex items-center gap-1 font-semibold whitespace-nowrap text-green-900">
                <FaBed className="text-green-600" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} beds`}
              </li>
              <li className=" flex items-center gap-1 font-semibold whitespace-nowrap text-green-900">
                <FaBath className="text-green-600" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bath`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className=" flex items-center gap-1 font-semibold whitespace-nowrap text-green-900">
                <FaParking className="text-green-600" />
                {listing.parking ? "parking sport" : "No Parking"}
              </li>
              <li className=" flex items-center gap-1 font-semibold whitespace-nowrap text-green-900">
                <FaChair className="text-green-600" />
                {listing.furnished ? "Furnished" : "Unfurnished "}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className=" bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
          </div>

          {contact && <Contact listing = {listing} />}
        </div>
      )}
    </main>
  );
};

export default Listing;
