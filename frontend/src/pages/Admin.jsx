import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import {
  Wrench,
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  Edit,
  Mail,
  Send,
  Check,
  X,
  Lock,
  Unlock,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

// Initialize Supabase Client for Storage bucket file uploads
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function Admin() {
  // Passcode / Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'bookings' | 'schedules' | 'blogs'

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // ---------------------------------------------------------------------------
  // TAB 1: SERVICES STATE
  // ---------------------------------------------------------------------------
  const [services, setServices] = useState([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    price: ''
  });

  // ---------------------------------------------------------------------------
  // TAB 2: BOOKINGS & OUTREACH STATE
  // ---------------------------------------------------------------------------
  const [bookings, setBookings] = useState([]);
  const [bookingFilter, setBookingFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'cancelled'
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [selectedBookingForOutreach, setSelectedBookingForOutreach] = useState(null);
  const [outreachFormData, setOutreachFormData] = useState({
    subject: '',
    message: ''
  });
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);

  // ---------------------------------------------------------------------------
  // TAB 3: SCHEDULES & SLOTS STATE
  // ---------------------------------------------------------------------------
  const [recurringSlots, setRecurringSlots] = useState([]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [daysOff, setDaysOff] = useState({
    Sunday: true,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false
  });
  const [dateOverrides, setDateOverrides] = useState([]);
  const [overrideInput, setOverrideInput] = useState({
    date: '',
    is_full_day_off: true,
    custom_slot: '',
    notes: ''
  });

  // ---------------------------------------------------------------------------
  // TAB 4: BLOG POSTS STATE
  // ---------------------------------------------------------------------------
  const [blogs, setBlogs] = useState([]);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    content: ''
  });
  const [selectedBlogFile, setSelectedBlogFile] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);

  // API Base URL helper
  const getApiBase = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // ---------------------------------------------------------------------------
  // FETCH ALL ADMIN DATA ON AUTH / TAB SWITCH
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    const apiBase = getApiBase();

    try {
      if (activeTab === 'services') {
        const res = await axios.get(`${apiBase}/api/services`);
        setServices(res.data || []);
      } else if (activeTab === 'bookings') {
        const res = await axios.get(`${apiBase}/api/bookings`);
        setBookings(res.data || []);
      } else if (activeTab === 'schedules') {
        const res = await axios.get(`${apiBase}/api/schedules`);
        if (res.data) {
          setRecurringSlots(res.data.recurring_slots || []);
          if (res.data.days_off) setDaysOff(res.data.days_off);
          setDateOverrides(res.data.date_overrides || []);
        }
      } else if (activeTab === 'blogs') {
        const res = await axios.get(`${apiBase}/api/blogs`);
        setBlogs(res.data || []);
      }
    } catch (err) {
      console.error(`Error fetching data for tab ${activeTab}:`, err);
      showMessage('error', `Failed to load ${activeTab} data from backend.`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 4000);
  };

  // Handle Authentication submit
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const defaultPasscode = '1234'; // Shop Manager default passcode
    if (passcode === defaultPasscode || passcode === 'admin') {
      setIsAuthenticated(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid management passcode. Please try again.');
    }
  };

  // ---------------------------------------------------------------------------
  // TAB 1 ACTIONS: SERVICES
  // ---------------------------------------------------------------------------
  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingServiceId(service.id);
      setServiceFormData({
        title: service.title || '',
        description: service.description || '',
        price: service.price || ''
      });
    } else {
      setEditingServiceId(null);
      setServiceFormData({ title: '', description: '', price: '' });
    }
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    if (e) e.preventDefault();
    const apiBase = getApiBase();

    try {
      if (editingServiceId) {
        await axios.put(`${apiBase}/api/services/${editingServiceId}`, serviceFormData);
        showMessage('success', 'Service updated successfully.');
      } else {
        await axios.post(`${apiBase}/api/services`, serviceFormData);
        showMessage('success', 'New service created successfully.');
      }
      setServiceModalOpen(false);
      fetchAllAdminData();
    } catch (err) {
      console.error('Error saving service:', err);
      showMessage('error', 'Failed to save service.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    const apiBase = getApiBase();

    try {
      await axios.delete(`${apiBase}/api/services/${id}`);
      showMessage('success', 'Service deleted successfully.');
      fetchAllAdminData();
    } catch (err) {
      console.error('Error deleting service:', err);
      showMessage('error', 'Failed to delete service.');
    }
  };

  // ---------------------------------------------------------------------------
  // TAB 2 ACTIONS: BOOKINGS & OUTREACH
  // ---------------------------------------------------------------------------
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const apiBase = getApiBase();
    try {
      await axios.patch(`${apiBase}/api/bookings/${bookingId}/status`, { status: newStatus });
      showMessage('success', `Booking marked as ${newStatus}.`);
      fetchAllAdminData();
    } catch (err) {
      console.error('Error updating status:', err);
      showMessage('error', 'Failed to update booking status.');
    }
  };

  const handleOpenOutreachModal = (booking) => {
    setSelectedBookingForOutreach(booking);
    setOutreachFormData({
      subject: `Update regarding your booking for ${booking.service_title || 'G&K Auto Service'}`,
      message: `Hi ${booking.client_name},\n\nThank you for choosing G&K Auto Detailing & Stereo Services.\n\n`
    });
    setOutreachModalOpen(true);
  };

  const handleSendOutreachEmail = async (e) => {
    e.preventDefault();
    if (!selectedBookingForOutreach) return;

    setIsSendingOutreach(true);
    const apiBase = getApiBase();

    try {
      await axios.post(`${apiBase}/api/bookings/${selectedBookingForOutreach.id}/reachout`, {
        subject: outreachFormData.subject,
        message: outreachFormData.message
      });
      showMessage('success', `Email sent successfully to ${selectedBookingForOutreach.client_email}`);
      setOutreachModalOpen(false);
    } catch (err) {
      console.error('Error sending outreach email:', err);
      showMessage('error', 'Failed to send automated email via backend mailer.');
    } finally {
      setIsSendingOutreach(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status?.toLowerCase() === bookingFilter.toLowerCase();
  });

  // ---------------------------------------------------------------------------
  // TAB 3 ACTIONS: SCHEDULES & SLOTS
  // ---------------------------------------------------------------------------
  const handleAddRecurringSlot = async (e) => {
    e.preventDefault();
    if (!newSlotInput.trim()) return;

    const updated = [...recurringSlots, newSlotInput.trim()];
    await saveScheduleState(updated, daysOff, dateOverrides);
    setNewSlotInput('');
  };

  const handleDeleteRecurringSlot = async (indexToDelete) => {
    const updated = recurringSlots.filter((_, idx) => idx !== indexToDelete);
    await saveScheduleState(updated, daysOff, dateOverrides);
  };

  const handleToggleDayOff = async (dayName) => {
    const updatedDaysOff = { ...daysOff, [dayName]: !daysOff[dayName] };
    setDaysOff(updatedDaysOff);
    await saveScheduleState(recurringSlots, updatedDaysOff, dateOverrides);
  };

  const handleAddDateOverride = async (e) => {
    e.preventDefault();
    if (!overrideInput.date) return;

    const newOverride = {
      id: Date.now().toString(),
      date: overrideInput.date,
      is_full_day_off: overrideInput.is_full_day_off,
      custom_slot: overrideInput.custom_slot || null,
      notes: overrideInput.notes || ''
    };

    const updatedOverrides = [...dateOverrides, newOverride];
    await saveScheduleState(recurringSlots, daysOff, updatedOverrides);
    setOverrideInput({ date: '', is_full_day_off: true, custom_slot: '', notes: '' });
  };

  const handleDeleteDateOverride = async (idToDelete) => {
    const updatedOverrides = dateOverrides.filter((item) => item.id !== idToDelete);
    await saveScheduleState(recurringSlots, daysOff, updatedOverrides);
  };

  const saveScheduleState = async (slots, days, overrides) => {
    const apiBase = getApiBase();
    try {
      await axios.post(`${apiBase}/api/schedules`, {
        recurring_slots: slots,
        days_off: days,
        date_overrides: overrides
      });
      setRecurringSlots(slots);
      setDaysOff(days);
      setDateOverrides(overrides);
      showMessage('success', 'Schedule settings saved to database.');
    } catch (err) {
      console.error('Error saving schedule:', err);
      showMessage('error', 'Failed to update schedule settings.');
    }
  };

  // ---------------------------------------------------------------------------
  // TAB 4 ACTIONS: BLOG POSTS & SUPABASE STORAGE
  // ---------------------------------------------------------------------------
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBlogFile(file);
      setBlogImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateBlogPost = async (e) => {
    e.preventDefault();
    if (!blogFormData.title || !blogFormData.content) {
      showMessage('error', 'Please fill in both the post title and content.');
      return;
    }

    setIsUploadingBlog(true);
    let publicImageUrl = '';

    try {
      if (selectedBlogFile && supabase) {
        const fileExt = selectedBlogFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `blog-covers/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, selectedBlogFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.warn('Supabase storage upload error, falling back to placeholder:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);
          publicImageUrl = publicUrlData?.publicUrl || '';
        }
      }

      const apiBase = getApiBase();
      await axios.post(`${apiBase}/api/blogs`, {
        title: blogFormData.title,
        content: blogFormData.content,
        image_url: publicImageUrl || 'https://images.unsplash.com/photo-1520340356584-f9917d1beb6d?auto=format&fit=crop&q=80&w=1000'
      });

      showMessage('success', 'Blog post published successfully!');
      setBlogFormData({ title: '', content: '' });
      setSelectedBlogFile(null);
      setBlogImagePreview(null);
      fetchAllAdminData();
    } catch (err) {
      console.error('Error creating blog post:', err);
      showMessage('error', 'Failed to publish blog post.');
    } finally {
      setIsUploadingBlog(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const apiBase = getApiBase();

    try {
      await axios.delete(`${apiBase}/api/blogs/${id}`);
      showMessage('success', 'Blog post deleted successfully.');
      fetchAllAdminData();
    } catch (err) {
      console.error('Error deleting blog post:', err);
      showMessage('error', 'Failed to delete blog post.');
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER AUTH SCREEN IF NOT LOGGED IN
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-[#70BAE6]/10 text-[#70BAE6]">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              G&amp;K Admin Portal
            </h1>
            <p className="text-sm text-slate-400">
              Enter shop manager passcode to access scheduling, services, bookings, and outreach tools.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Manager Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (Default: 1234)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#70BAE6] focus:ring-1 focus:ring-[#70BAE6] transition-all"
                autoFocus
              />
            </div>

            {passcodeError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#70BAE6]/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Unlock Admin Hub</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
            <span className="text-xs text-slate-500">G&amp;K Auto Detailing &amp; Stereo Services</span>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN DASHBOARD LAYOUT
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <span className="font-black text-lg tracking-tight text-white">G&amp;K ADMIN</span>
              <span className="bg-[#70BAE6]/20 text-[#70BAE6] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#70BAE6]/30">
                System Active
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={fetchAllAdminData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#70BAE6]' : ''}`} />
                <span>Sync Data</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAuthenticated(false)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-all"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Lock Hub</span>
              </button>
            </div>

          </div>

          {/* 4 Switchable Tabs Navigation */}
          <nav className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'services'
                  ? 'border-[#70BAE6] text-[#70BAE6]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>1. Services CRUD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-[#70BAE6] text-[#70BAE6]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>2. Bookings &amp; Outreach</span>
              {bookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="ml-1 bg-[#70BAE6] text-white text-xs px-2 py-0.5 rounded-full">
                  {bookings.filter(b => b.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'schedules'
                  ? 'border-[#70BAE6] text-[#70BAE6]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>3. Time Slots &amp; Matrix</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'blogs'
                  ? 'border-[#70BAE6] text-[#70BAE6]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Blog &amp; Supabase Storage</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Action Message Banner */}
        {actionMessage.text && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
              actionMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
              <span>{actionMessage.text}</span>
            </div>
            <button type="button" onClick={() => setActionMessage({ type: '', text: '' })}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Services Catalog</h2>
                <p className="text-sm text-slate-500">Add, update, or remove service offerings displayed on the public Home &amp; Booking pages.</p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenServiceModal()}
                className="inline-flex items-center justify-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#70BAE6] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="p-2.5 rounded-lg bg-[#70BAE6]/10 text-[#70BAE6]">
                        <Wrench className="w-5 h-5" />
                      </span>
                      {srv.price ? (
                        <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                          {srv.price}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Custom Quote</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{srv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{srv.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenServiceModal(srv)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#70BAE6] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(srv.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Modal */}
            {serviceModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {editingServiceId ? 'Edit Service Details' : 'Create New Service'}
                    </h3>
                    <button type="button" onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Service Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 3M Paint Protection Film"
                        value={serviceFormData.title}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Price (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Starting at $299 or leave blank"
                        value={serviceFormData.price}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Provide a comprehensive breakdown of what this service includes..."
                        value={serviceFormData.description}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t">
                      <button
                        type="button"
                        onClick={() => setServiceModalOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold px-5 py-2 rounded-xl text-xs shadow"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKING MONITORING & CLIENT OUTREACH */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Client Bookings Queue</h2>
                <p className="text-sm text-slate-500">Monitor incoming appointments, adjust status, and trigger SMTP client emails.</p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      bookingFilter === f
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-sm">
                  No bookings found matching filter: <strong className="capitalize">{bookingFilter}</strong>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Client Info</th>
                        <th className="px-6 py-4">Service &amp; Time</th>
                        <th className="px-6 py-4">Client Note</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{b.client_name}</div>
                            <div className="text-xs text-slate-500">{b.client_email}</div>
                            <div className="text-xs text-[#70BAE6] font-medium">{b.client_phone}</div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{b.service_title}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-[#70BAE6]" />
                              <span>{b.booking_date}</span>
                              <Clock className="w-3 h-3 text-[#70BAE6] ml-1" />
                              <span>{b.time_slot}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-xs text-slate-600 truncate">{b.message || 'No additional note provided.'}</p>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : b.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {b.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                              {b.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                              {b.status === 'pending' && <Clock3 className="w-3 h-3" />}
                              <span className="capitalize">{b.status || 'pending'}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenOutreachModal(b)}
                              className="inline-flex items-center gap-1 text-xs font-bold bg-[#70BAE6]/10 text-[#70BAE6] hover:bg-[#70BAE6] hover:text-white px-3 py-1.5 rounded-lg transition-all"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reach Out</span>
                            </button>

                            {b.status !== 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                title="Confirm Booking"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {b.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                className="inline-flex items-center gap-1 text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 px-2.5 py-1.5 rounded-lg transition-colors"
                                title="Cancel Booking"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Outreach Modal */}
            {outreachModalOpen && selectedBookingForOutreach && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2 text-[#70BAE6]">
                      <Send className="w-5 h-5" />
                      <h3 className="text-lg font-bold text-slate-900">Send Client Outreach Email</h3>
                    </div>
                    <button type="button" onClick={() => setOutreachModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p><strong className="text-slate-700">Recipient:</strong> {selectedBookingForOutreach.client_name} ({selectedBookingForOutreach.client_email})</p>
                    <p><strong className="text-slate-700">Service:</strong> {selectedBookingForOutreach.service_title}</p>
                    <p><strong className="text-slate-700">SMTP Sender:</strong> emailsystem95@gmail.com (Backend Automated Mailer)</p>
                  </div>

                  <form onSubmit={handleSendOutreachEmail} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Subject *</label>
                      <input
                        type="text"
                        required
                        value={outreachFormData.subject}
                        onChange={(e) => setOutreachFormData({ ...outreachFormData, subject: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Custom Client Message *</label>
                      <textarea
                        required
                        rows={6}
                        value={outreachFormData.message}
                        onChange={(e) => setOutreachFormData({ ...outreachFormData, message: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t">
                      <button
                        type="button"
                        onClick={() => setOutreachModalOpen(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSendingOutreach}
                        className="inline-flex items-center gap-2 bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow"
                      >
                        {isSendingOutreach ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Sending Mail...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Dispatch Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIME SLOT & SCHEDULE CONFIGURATION */}
        {activeTab === 'schedules' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Schedule &amp; Availability Matrix</h2>
              <p className="text-sm text-slate-500">Configure recurring daily appointment windows, weekly days off, and specific date blockouts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Recurring Slots */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Clock className="w-5 h-5 text-[#70BAE6]" />
                  <h3 className="text-base font-bold text-slate-900">Daily Recurring Time Slots</h3>
                </div>

                <form onSubmit={handleAddRecurringSlot} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 01:00 PM - 03:00 PM"
                    value={newSlotInput}
                    onChange={(e) => setNewSlotInput(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#70BAE6]"
                  />
                  <button
                    type="submit"
                    className="bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Slot</span>
                  </button>
                </form>

                <div className="space-y-2">
                  {recurringSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800">
                      <span>{slot}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecurringSlot(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Days Off Rules */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b">
                  <Calendar className="w-5 h-5 text-[#70BAE6]" />
                  <h3 className="text-base font-bold text-slate-900">Weekly Days Off Rules</h3>
                </div>

                <div className="space-y-3">
                  {Object.keys(daysOff).map((dayName) => (
                    <div key={dayName} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-sm font-bold text-slate-800">{dayName}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleDayOff(dayName)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                          daysOff[dayName]
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {daysOff[dayName] ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>CLOSED</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>OPEN FOR BOOKING</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Overrides & Holiday Closures */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#70BAE6]" />
                  <h3 className="text-base font-bold text-slate-900">Specific Date Overrides &amp; Holiday Closures</h3>
                </div>
              </div>

              <form onSubmit={handleAddDateOverride} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Date *</label>
                  <input
                    type="date"
                    required
                    value={overrideInput.date}
                    onChange={(e) => setOverrideInput({ ...overrideInput, date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#70BAE6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Override Action</label>
                  <select
                    value={overrideInput.is_full_day_off ? 'off' : 'custom'}
                    onChange={(e) => setOverrideInput({ ...overrideInput, is_full_day_off: e.target.value === 'off' })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#70BAE6]"
                  >
                    <option value="off">Block Full Day Off (Closed)</option>
                    <option value="custom">Add Custom Time Slot Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Slot / Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Holiday or 04:00 PM - 06:00 PM"
                    value={overrideInput.custom_slot}
                    onChange={(e) => setOverrideInput({ ...overrideInput, custom_slot: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#70BAE6]"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold py-2 rounded-xl text-xs shadow"
                  >
                    Add Date Override
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {dateOverrides.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No specific date overrides configured.</p>
                ) : (
                  dateOverrides.map((ov) => (
                    <div key={ov.id} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">{ov.date}</span>
                        {ov.is_full_day_off ? (
                          <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-extrabold">Full Day Closed</span>
                        ) : (
                          <span className="bg-[#70BAE6]/20 text-[#70BAE6] px-2.5 py-0.5 rounded-full font-bold">Custom: {ov.custom_slot}</span>
                        )}
                      </div>
                      <button type="button" onClick={() => handleDeleteDateOverride(ov.id)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLOG POST EDITOR & SUPABASE STORAGE */}
        {activeTab === 'blogs' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Blog &amp; Knowledge Base Manager</h2>
              <p className="text-sm text-slate-500">Publish posts with direct Supabase Storage image bucket uploads (`blog-images`).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Creator Form */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b">Create New Blog Article</h3>

                <form onSubmit={handleCreateBlogPost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Why 3M Paint Protection is Essential for Calgary Winters"
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image Upload (Supabase Bucket)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-[#70BAE6] transition-colors relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="space-y-2 pointer-events-none">
                        <Upload className="w-8 h-8 text-[#70BAE6] mx-auto" />
                        <p className="text-xs font-bold text-slate-700">Click or drag image file here</p>
                        <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP stored in Supabase `blog-images` bucket</p>
                      </div>
                    </div>

                    {blogImagePreview && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 max-h-40">
                        <img src={blogImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Article Content *</label>
                    <textarea
                      required
                      rows={8}
                      placeholder="Write your blog content here..."
                      value={blogFormData.content}
                      onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#70BAE6]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingBlog}
                    className="w-full bg-[#70BAE6] hover:bg-[#58A6D3] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isUploadingBlog ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading to Supabase &amp; Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Publish Article</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column: Existing Posts List */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b">Published Articles ({blogs.length})</h3>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {blogs.length === 0 ? (
                    <p className="text-xs text-slate-400">No blog posts found.</p>
                  ) : (
                    blogs.map((b) => (
                      <div key={b.id} className="flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#70BAE6] transition-all bg-slate-50/50">
                        {b.image_url && (
                          <img
                            src={b.image_url}
                            alt={b.title}
                            className="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{b.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2">{b.content}</p>
                          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Likes: {b.likes || 0}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(b.id)}
                              className="text-rose-600 font-bold hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}