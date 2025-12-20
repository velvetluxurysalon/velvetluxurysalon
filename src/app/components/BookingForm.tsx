import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, X, AlertCircle, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getServices, bookAppointment, getStaff, checkStylistAvailability } from "../services/firebaseService";

interface BookingFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function BookingForm({ isOpen = false, onClose }: BookingFormProps) {
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(isOpen);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [stylistAvailability, setStylistAvailability] = useState<string>("");
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    customerName: user?.displayName || "",
    customerEmail: user?.email || "",
    customerPhone: "",
    serviceId: "",
    stylistId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: ""
  });

  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowForm(true);
    }
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

  const handleStylistChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stylistId = e.target.value;
    setFormData({ ...formData, stylistId, appointmentTime: "" });
    setStylistAvailability("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData({ ...formData, appointmentDate: date, appointmentTime: "" });
    setStylistAvailability("");
    // Generate time slots (every 30 minutes from 9 AM to 6 PM)
    const slots = [];
    for (let i = 9; i < 18; i++) {
      slots.push(`${String(i).padStart(2, "0")}:00`);
      slots.push(`${String(i).padStart(2, "0")}:30`);
    }
    setAvailableSlots(slots);
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    setFormData({ ...formData, appointmentTime: time });
    
    if (formData.stylistId && formData.appointmentDate && time) {
      try {
        const isAvailable = await checkStylistAvailability(formData.stylistId, formData.appointmentDate, time);
        if (!isAvailable) {
          const availableAfter = new Date(`${formData.appointmentDate}T${time}`);
          availableAfter.setHours(availableAfter.getHours() + 1);
          const availableTimeStr = availableAfter.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          setStylistAvailability(`⏱️ This stylist is busy from ${time} to ${availableAfter.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}. Available after ${availableTimeStr}`);
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

    try {
      setSubmitLoading(true);
      setError("");

      const appointmentData = {
        customerId: user?.uid,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        serviceId: formData.serviceId,
        stylistId: formData.stylistId,
        appointmentDate: new Date(`${formData.appointmentDate}T${formData.appointmentTime}`),
        appointmentTime: formData.appointmentTime,
        notes: formData.notes,
        status: "pending"
      };

      await bookAppointment(appointmentData);

      setSuccess("Appointment booked successfully! We'll confirm via email.");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white p-8 max-h-[90vh] overflow-y-auto">
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
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-700 font-medium">Please login to book an appointment</p>
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
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
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
                  <option value="">Choose your preferred stylist</option>
                  {staff.map((stylist) => (
                    <option key={stylist.id} value={stylist.id}>
                      {stylist.name} {stylist.specialization && `- ${stylist.specialization}`}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Appointment Time *
                  </label>
                  <select
                    value={formData.appointmentTime}
                    onChange={handleTimeChange}
                    disabled={!formData.appointmentDate}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select a time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {stylistAvailability && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
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
