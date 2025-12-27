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
    setBookedSlots([]); // Reset booked slots
    
    // Fetch booked slots for the selected stylist on the current date
    if (stylistId && formData.appointmentDate) {
      try {
        const booked = await getBookedSlotsForStylist(stylistId, formData.appointmentDate);
        setBookedSlots(booked);
        console.log('Booked slots for stylist:', booked);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
        setBookedSlots([]);
      }
    }
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, appointmentDate: date, appointmentTime: "" });
    setStylistAvailability("");
    setBookedSlots([]); // Reset booked slots
    
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
        console.log('Booked slots for date:', date, 'stylist:', formData.stylistId, 'booked:', booked);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
        setBookedSlots([]);
      }
    }
  };

  const handleTimeSelect = async (timeValue: string, timeDisplay: string) => {
    // Check if the slot is booked before allowing selection
    if (bookedSlots.includes(timeValue)) {
      setStylistAvailability(`⚠️ This time slot (${timeDisplay}) is already booked. Please select another time.`);
      return;
    }

    setFormData({ ...formData, appointmentTime: timeValue });
    
    if (formData.stylistId && formData.appointmentDate) {
      try {
        const isAvailable = await checkStylistAvailability(formData.stylistId, formData.appointmentDate, timeValue);
        if (!isAvailable) {
          setStylistAvailability(`⚠️ This stylist is already booked at ${timeDisplay}. Please select another time slot.`);
          setFormData({ ...formData, appointmentTime: "" }); // Reset time
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

      // Use phone number as customerId (normalized)
      const normalizedPhone = formData.customerPhone.replace(/[\s\-()]/g, '').trim();

      const appointmentData = {
        customerId: normalizedPhone, // Use phone as customer ID
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: normalizedPhone,
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

      setSuccess("✅ Appointment booked successfully! We'll confirm via email.");
      setSubmitLoading(false);
      
      // Auto-close the success popup and form after 4 seconds
      setTimeout(() => {
        // Reset all form state
        setFormData({
          customerName: user?.displayName || "",
          customerEmail: user?.email || "",
          customerPhone: "",
          serviceId: "",
          stylistId: stylistId || "",
          appointmentDate: "",
          appointmentTime: "",
          notes: ""
        });
        setAvailableSlots([]);
        setBookedSlots([]);
        setStylistAvailability("");
        setSuccess("");
        setError("");
        setShowForm(false);
        if (onClose) onClose();
      }, 4000);
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("❌ Failed to book appointment. Please try again.");
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
    <>
      {/* Success Popup - Shown above everything */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-[2000] pointer-events-auto">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          {/* Popup Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-4">{success}</p>
              <div className="w-full bg-green-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-700 font-medium">✓ Your appointment has been successfully scheduled</p>
              </div>
              <button
                onClick={() => {
                  setSuccess("");
                  setShowForm(false);
                  if (onClose) onClose();
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
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
                          const isSelected = formData.appointmentTime === slot.value;
                          
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              onClick={() => !isBooked && handleTimeSelect(slot.value, slot.time)}
                              disabled={isBooked}
                              className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed opacity-50'
                                  : isSelected
                                  ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-2'
                                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-400 hover:shadow-md cursor-pointer'
                              }`}
                              title={isBooked ? `Already booked at ${slot.time}` : `Select ${slot.time}`}
                            >
                              <div className="text-center">
                                <div>{slot.time}</div>
                                {isBooked && <span className="block text-xs font-bold">BOOKED</span>}
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
    </>
  );
}
