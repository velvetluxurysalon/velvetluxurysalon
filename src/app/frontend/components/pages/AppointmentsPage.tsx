import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import BookingForm from "../BookingForm";
import { Calendar, Clock, Trash2, Plus, AlertCircle } from "lucide-react";
import {
  getCustomerAppointments,
  cancelAppointment,
  Appointment,
} from "../../services/firebaseService";

export default function AppointmentsPage() {
  const { user, customerData, setShowLoginModal } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !customerData) {
      setShowLoginModal?.(true);
      return;
    }

    loadAppointments();
  }, [user, customerData]);

  const loadAppointments = async () => {
    if (!customerData?.id) return;

    try {
      setLoading(true);
      setError("");
      const data = await getCustomerAppointments(customerData.id);
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);

      await cancelAppointment(appointmentId);
      setSuccessMessage("Appointment cancelled successfully!");

      // Reload appointments
      await loadAppointments();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= new Date() && apt.status !== "cancelled";
  });

  const pastAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate < new Date() || apt.status === "cancelled";
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Please Log In
          </h1>
          <p className="text-slate-600 mb-8">
            You need to be logged in to view and manage your appointments.
          </p>
          <button
            onClick={() => setShowLoginModal?.(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Log In to Your Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                My Appointments
              </h1>
              <p className="text-slate-600 mt-1">
                Manage your upcoming and past appointments
              </p>
            </div>
            <button
              onClick={() => setShowBookingForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              <Plus size={20} />
              Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mx-4 mt-4 max-w-6xl mx-auto flex gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mx-4 mt-4 max-w-6xl mx-auto flex gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={20} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <>
            {/* Upcoming Appointments */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Upcoming Appointments
              </h2>

              {upcomingAppointments.length === 0 ? (
                <div className="bg-white/80 backdrop-blur rounded-lg border border-slate-200 p-8 text-center">
                  <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-4">
                    You don't have any upcoming appointments
                  </p>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white/80 backdrop-blur rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {appointment.serviceName}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {appointment.stylistName && (
                              <>
                                with{" "}
                                <span className="font-medium">
                                  {appointment.stylistName}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                              appointment.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : appointment.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {appointment.status?.toUpperCase() || "PENDING"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={16} />
                          <span>
                            {new Date(
                              appointment.appointmentDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={16} />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                        {appointment.duration && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock size={16} />
                            <span>{appointment.duration} min</span>
                          </div>
                        )}
                      </div>

                      {appointment.notes && (
                        <div className="mb-4 p-3 bg-slate-50 rounded text-sm text-slate-700">
                          <p className="font-semibold mb-1">Notes:</p>
                          <p>{appointment.notes}</p>
                        </div>
                      )}

                      <button
                        onClick={() => handleCancelAppointment(appointment.id!)}
                        disabled={cancellingId === appointment.id}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        {cancellingId === appointment.id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Past Appointments
                </h2>

                <div className="grid gap-4">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-white/80 backdrop-blur rounded-lg border border-slate-200 p-6 opacity-75 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {appointment.serviceName}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {appointment.stylistName && (
                              <>
                                with{" "}
                                <span className="font-medium">
                                  {appointment.stylistName}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                              appointment.status === "cancelled"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {appointment.status === "cancelled"
                              ? "CANCELLED"
                              : "COMPLETED"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={16} />
                          <span>
                            {new Date(
                              appointment.appointmentDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={16} />
                          <span>{appointment.appointmentTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Form Modal */}
      <BookingForm
        isOpen={showBookingForm}
        onClose={() => {
          setShowBookingForm(false);
          // Reload appointments after booking
          loadAppointments();
        }}
      />
    </div>
  );
}
