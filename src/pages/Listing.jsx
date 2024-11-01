import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useParams();

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
        console.log(listing);
                
        
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
        <p className="text-center my-7 text-2xl ">Error loading listing.</p>
      )}
      {listing && !isLoading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] "
                  style={{ background: `url(${url}) center no-repeat`,backgroundSize:'cover' }}
                
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
