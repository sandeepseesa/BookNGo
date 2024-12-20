import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PackageCard from "../components/PackageCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import { useSnackbar } from 'notistack';
import BASE_URL from "../config.js";


const Package = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    numberoftravelers: 1,
    selectedDate: "",
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/package`);
      setPackages(response.data);
    } catch (error) {

      enqueueSnackbar("Failed to load packages", { variant: 'error' });
    }
  };

  const handleBookClick = (pkg) => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to book a package", { variant: 'warning' });
      navigate("/login");
      return;
    }

    if (!pkg.availableDates || pkg.availableDates.length === 0) {
      enqueueSnackbar("No available dates for this package", { variant: 'error' });
      return;
    }

    setSelectedPackage(pkg);
  };

  const handleBookPackage = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      enqueueSnackbar("Please login to book a package", { variant: 'warning' });
      navigate("/login");
      return;
    }

    try {
      const token = axios.defaults.headers.common['Authorization'];
      const response = await axios.post(
        `${BASE_URL}/booking`,
        {
          packageId: selectedPackage._id,
          selectedDate: new Date(formData.selectedDate),
          numberoftravelers: parseInt(formData.numberoftravelers)
        },
        {
          headers: { Authorization: token }
        }
      );

      if (response.data.message === 'Booking successful!') {
        enqueueSnackbar('Booking successful!', { variant: 'success' });
        setSelectedPackage(null);
        setFormData({
          numberoftravelers: 1,
          selectedDate: "",
        });
        await fetchPackages();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
      }
      enqueueSnackbar(
        error.response?.data?.message || "Booking failed!",
        { variant: 'error' }
      );
    }
  };

  return (
      
    <div className=" min-h-screen p-6 relative top-16">

      
      {/* <div className="">
        <h3 className="text-4xl font-bold text-gray-100">Your Gateway to Amazing Journeys!</h3>
        <h2 className="text-2xl font-semibold text-gray-200 mt-8 text-black">Dreaming of your next adventure? Let us make it happen.<br></br>
          We specialize in crafting unforgettable travel experiences tailored just for you.</h2>
      </div>
<div className="text-white">
      <h1>Welcome to [Your Company Name] - Your Gateway to Amazing Journeys!</h1>
<p>
  Dreaming of your next adventure? Let us make it happen.<br></br>
  At <strong>[Your Company Name]</strong>, we specialize in crafting unforgettable travel experiences tailored just for you.
</p>

<hr></hr>

<h2>Explore the World with Ease</h2>
<ul>
  <li>Find the best deals on flights, hotels, and vacation packages.</li>
  <li>Discover personalized itineraries for solo travelers, families, and groups.</li>
  <li>Seamless booking, exceptional service, and 24/7 support.</li>
</ul>

<hr></hr>

<h2>Why Travel with Us?</h2>
<p>
  ✅ Exclusive deals and discounts.<br></br>
  ✅ Trusted by millions of happy travelers.<br></br>
  ✅ Easy-to-use platform for all your travel needs.
</p>

<hr></hr>

<p>
  🌍 <strong>Your Next Adventure Awaits!</strong><br></br>
  From breathtaking beaches to vibrant cityscapes, the world is yours to explore.<br></br>
  <strong>Book now and let your journey begin.</strong>
</p> </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg._id}
            pkg={pkg}
            isAuthenticated={isAuthenticated}
            onBookClick={handleBookClick}
          />
        ))}
      </div>

      {selectedPackage && (
        <BookingModal
          selectedPackage={selectedPackage}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setSelectedPackage(null)}
          onSubmit={handleBookPackage}
        />
      )}
    </div>
  );
};

export default Package;
