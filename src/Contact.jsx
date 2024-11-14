import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onchange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3 mx-auto  max-w-3xl">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="mesage"
            id="message"
            rows="2"
            value={message}
            onChange={onchange}
            placeholder="Enter your message.."
            className="w-full border p-3 rounded-lg"
          ></textarea>
        <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name} &body=${message}`}
            className="bg-slate-700 text-white text-center rounded-lg p-3"
          >
           Send message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
