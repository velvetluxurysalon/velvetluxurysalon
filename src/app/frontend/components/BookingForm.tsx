import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, X, AlertCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getServices, bookAppointment, getStaff, checkStylistAvailability, getBookedSlotsForStylist } from "../services/firebaseService";


interface BookingFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  stylistId?: string | null;
}

export default function BookingForm({ isOpen = false, onClose, stylistId }: BookingFormProps) {
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(isOpen);

  // Always sync showForm with isOpen prop
  useEffect(() => {
    setShowForm(isOpen);
  }, [isOpen]);
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; value: string }>>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [stylistAvailability, setStylistAvailability] = useState<string>("");
  const { user, isAuthenticated, setShowLoginModal } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.displayName || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    serviceId: "",
    stylistId: stylistId || "",
    appointmentDate: "",
    appointmentTime: "",
    notes: ""
  });

  // Update stylistId in formData if prop changes and modal is opened
  useEffect(() => {
    if (isOpen && stylistId) {
      setFormData((prev) => ({ ...prev, stylistId }));
    }
  }, [isOpen, stylistId]);

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowForm(true);
      // Scroll to top when modal opens
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      setError("");
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again later.");
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const getAvailableStaff = () => {
    if (!formData.serviceId) {
      // If no service selected, return all staff
      return staff;
    }
    
    const selectedService = services.find(s => s.id === formData.serviceId);
    if (!selectedService) return staff;
    
    // Filter staff by service category (staff role should match service category)
    const filtered = staff.filter(member => member.role === selectedService.category);
    // If no staff matches the category, return all staff
    return filtered.length > 0 ? filtered : staff;
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, serviceId: e.target.value, stylistId: "", appointmentTime: "" });
    setStylistAvailability("");
  };

  const handleStylistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stylistId = e.target.value;
    setFormData({ ...formData, stylistId, appointmentTime: "" });
    setStylistAvailability("");
    
    // Fetch booked slots for the selected stylist on the current date
    if (stylistId && formData.appointmentDate) {
      try {
        const booked = await getBookedSlotsForStylist(stylistId, formData.appointmentDate);
        setBookedSlots(booked);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, appointmentDate: date, appointmentTime: "" });
    setStylistAvailability("");
    setBookedSlots([]);
    
    // Generate time slots (hourly from 8 AM to 9 PM)
    const slots: Array<{ time: string; value: string }> = [];
    const now = new Date();
    const selectedDate = new Date(date);
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    
    for (let hour = 8; hour <= 20; hour++) {
      // Skip past hours for today
      if (isToday && hour <= currentHour) {
        continue;
      }
      
      let displayHour = hour;
      let period = 'AM';
      
      if (hour === 12) {
        displayHour = 12;
        period = 'PM';
      } else if (hour > 12) {
        displayHour = hour - 12;
        period = 'PM';
      }
      
      const timeValue = `${String(hour).padStart(2, "0")}:00`;
      const timeDisplay = `${displayHour}:00 ${period}`;
      slots.push({ time: timeDisplay, value: timeValue });
    }
    setAvailableSlots(slots);
    
    // Fetch booked slots if stylist is selected
    if (formData.stylistId) {
      try {
        const booked = await getBookedSlotsForStylist(formData.stylistId, date);
        setBookedSlots(booked);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    }
  };

  const handleTimeSelect = async (timeValue: string, timeDisplay: string) => {
    setFormData({ ...formData, appointmentTime: timeValue });
    
    if (formData.stylistId && formData.appointmentDate) {
      try {
        const isAvailable = await checkStylistAvailability(formData.stylistId, formData.appointmentDate, timeValue);
        if (!isAvailable) {
          setStylistAvailability(`⚠️ This stylist is already booked at ${timeDisplay}. Please select another time slot.`);
        } else {
          setStylistAvailability("");
        }
      } catch (err) {
        console.error('Error checking availability:', err);
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Please login to book an appointment");
      return;
    }

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.serviceId ||
      !formData.stylistId ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      setError("Please fill all required fields");
      return;
    }

    // Check availability one more time before submitting
    try {
      const isAvailable = await checkStylistAvailability(formData.stylistId, formData.appointmentDate, formData.appointmentTime);
      if (!isAvailable) {
        setError("This time slot is no longer available. Please select another time.");
        return;
      }
    } catch (err) {
      console.error('Error checking availability:', err);
    }

    try {
      setSubmitLoading(true);
      setError("");

      const appointmentData = {
        customerId: user?.uid,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        serviceId: formData.serviceId,
        serviceName: services.find(s => s.id === formData.serviceId)?.name,
        stylistId: formData.stylistId,
        stylistName: staff.find(s => s.id === formData.stylistId)?.name,
        appointmentDate: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`),
        appointmentTime: formData.appointmentTime,
        notes: formData.notes,
        status: "pending"
      };

      await bookAppointment(appointmentData);

      setSuccess("Appointment booked successfully! We'll confirm via email.");
      
      // Keep form visible for 2 seconds to show success message, then close
      setTimeout(() => {
        setFormData({
          customerName: user?.displayName || "",
          customerEmail: user?.email || "",
          customerPhone: "",
          serviceId: "",
          stylistId: "",
          appointmentDate: "",
          appointmentTime: "",
          notes: ""
        });
        setShowForm(false);
        onClose?.();
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    onClose?.();
  };

  if (!showForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4 pt-20">
      <Card className="w-full max-w-2xl bg-white p-8 max-h-[85vh] overflow-y-auto my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-purple-600">Book an Appointment</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Book Your Appointment?</h3>
              <p className="text-gray-600 text-lg mb-4">Sign in to your account to complete your booking with us.</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">It only takes a minute to sign in or create a new account.</p>
              <Button
                onClick={() => {
                  setShowLoginModal(true);
                  handleClose();
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold"
              >
                Continue to Sign In
              </Button>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="+1 (234) 567-8900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={handleServiceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Select Stylist *
                </label>
                <select
                  value={formData.stylistId}
                  onChange={handleStylistChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a stylist</option>
                  {getAvailableStaff().map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Select Appointment Time *
                  </label>
                  {!formData.appointmentDate ? (
                    <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
                      Please select a date first to view available time slots
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {availableSlots.map((slot: any) => {
                          const isBooked = bookedSlots.includes(slot.value);
                          return (
                            <button
                              key={slot.value}
                              onClick={() => !isBooked && handleTimeSelect(slot.value, slot.time)}
                              disabled={isBooked}
                              className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                isBooked
                                  ? 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-60'
                                  : formData.appointmentTime === slot.value
                                  ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-2'
                                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-400 hover:shadow-md cursor-pointer'
                              }`}
                            >
                              <div className="text-center">
                                {slot.time}
                                {isBooked && <span className="block text-xs mt-1">Booked</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {stylistAvailability && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700">{stylistAvailability}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                rows={3}
                placeholder="Any special requests or notes..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={submitLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {submitLoading ? "Booking..." : "Book Appointment"}
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
                disabled={submitLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
