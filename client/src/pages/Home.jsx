import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PackageCard from "../components/PackageCard";
import BookingModal from "../components/BookingModal";
import { useSnackbar } from 'notistack';

const Home = ({ isAuthenticated }) => {
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
      const response = await axios.get("https://bookngo-server.onrender.com/package");
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
      if (formData.numberoftravelers > selectedPackage.maxTravelers) {
        enqueueSnackbar(`Maximum ${selectedPackage.maxTravelers} travelers allowed`, { variant: 'error' });
        return;
      }

      const bookingData = {
        packageId: selectedPackage._id,
        selectedDate: new Date(formData.selectedDate),
        numberoftravelers: parseInt(formData.numberoftravelers)
      };

      const response = await axios.post(
        "https://bookngo-server.onrender.com/booking",
        bookingData,
        { withCredentials: true }
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
    
      enqueueSnackbar(error.response?.data?.message || "Booking failed!", { variant: 'error' });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 relative">
      <h1 className="text-3xl font-bold text-gray-600 text-center mb-8">
        Available Travel Packages
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Home;
