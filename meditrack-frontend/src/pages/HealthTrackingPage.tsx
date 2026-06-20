import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Activity, HeartPulse, Scale, Footprints, AlertCircle, PlusCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function HealthTrackingPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [showLogForm, setShowLogForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({
    weight: '',
    height: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    steps: ''
  });

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      const meRes = await axios.get('http://localhost:8080/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const studentId = meRes.data?.profile?.studentId;
      
      if (studentId) {
        const res = await axios.get(`http://localhost:8080/api/health-metrics/student/${studentId}`);
        setMetrics(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch health metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    
    // Poll for updates (e.g. if synced from external device in future)
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const meRes = await axios.get('http://localhost:8080/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const studentId = meRes.data?.profile?.studentId;

      if (!studentId) return;

      const payload = {
        studentId,
        weight: parseFloat(form.weight) || 0,
        height: parseFloat(form.height) || 0,
        bloodPressureSystolic: parseInt(form.bloodPressureSystolic) || 0,
        bloodPressureDiastolic: parseInt(form.bloodPressureDiastolic) || 0,
        heartRate: parseInt(form.heartRate) || 0,
        steps: parseInt(form.steps) || 0,
      };

      await axios.post('http://localhost:8080/api/health-metrics', payload);
      
      setSuccessMsg('Vitals logged successfully!');
      setForm({ weight: '', height: '', bloodPressureSystolic: '', bloodPressureDiastolic: '', heartRate: '', steps: '' });
      setShowLogForm(false);
      fetchMetrics();
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to log vitals', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare data for charts
  const chartData = metrics.map(m => ({
    name: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    HeartRate: m.heartRate,
    Weight: m.weight,
    Steps: m.steps,
    BMI: m.bmi
  }));

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <Navbar />
      
      {/* Header section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-16 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 flex items-center gap-3">
              <Activity className="w-10 h-10" />
              Health Dashboard
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
              Monitor your vital signs, track your progress, and stay on top of your wellness goals.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Check className="w-6 h-6" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Form removed as it's now updated by the doctor */}

        {/* Latest Vitals Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500"><HeartPulse className="w-7 h-7"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Heart Rate</p>
              <p className="text-2xl font-black text-slate-800">{latestMetric?.heartRate || '--'} <span className="text-sm font-medium text-slate-500">bpm</span></p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500"><Activity className="w-7 h-7"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Blood Pressure</p>
              <p className="text-2xl font-black text-slate-800">
                {latestMetric ? `${latestMetric.bloodPressureSystolic}/${latestMetric.bloodPressureDiastolic}` : '--/--'} 
                <span className="text-sm font-medium text-slate-500 ml-1">mmHg</span>
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500"><Footprints className="w-7 h-7"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daily Steps</p>
              <p className="text-2xl font-black text-slate-800">{latestMetric?.steps || '--'}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500"><Scale className="w-7 h-7"/></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current BMI</p>
              <p className="text-2xl font-black text-slate-800">{latestMetric?.bmi || '--'}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {metrics.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <HeartPulse className="text-rose-500 w-5 h-5"/> Heart Rate Trends
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{stroke: '#f43f5e', strokeWidth: 1, strokeDasharray: '4 4'}}
                    />
                    <Area type="monotone" dataKey="HeartRate" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" activeDot={{r: 6, strokeWidth: 0}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Scale className="text-purple-500 w-5 h-5"/> Weight & BMI
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="Weight" stroke="#a855f7" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    <Line yAxisId="right" type="monotone" dataKey="BMI" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Activity className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No Data Available</h3>
              <p className="text-slate-500 mb-6">Your doctor will log your first set of vitals to see your health trends here.</p>
            </div>
          )
        )}

      </main>
    </div>
  );
}
