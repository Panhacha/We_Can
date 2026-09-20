"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, ShieldAlert, Key, Smartphone, History, Bell, Globe, Moon, User, CheckCircle2, Search, Edit3 } from 'lucide-react';

// Mock Activity Logs
const mockActivityLogs = [
  { id: 1, action: "Changed price of item 'Classic Leather Jacket' from $120 to $100", time: "10 mins ago", type: "update" },
  { id: 2, action: "Updated status of Order #1024 to 'Shipped/In Transit'", time: "2 hours ago", type: "order" },
  { id: 3, action: "Logged in from new IP Address (192.168.1.5)", time: "1 day ago", type: "security" },
  { id: 4, action: "Added new staff member 'johndoe@wecan.com'", time: "3 days ago", type: "admin" },
];

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  
  // Local state for UI toggles
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const role = user?.role || 'Super Admin';
  const roleColor = role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className="max-w-[1200px] mx-auto pb-20 animate-fade-in font-sans">
      
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-white mb-1 leading-none">Admin Profile</h2>
        <p className="text-white/50 text-sm font-medium">Manage your security, preferences, and view activity logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Info & Preferences */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Profile Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 shadow-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            
            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-[#16161a] overflow-hidden bg-[#16161a] shadow-md mt-6 mb-4">
              <img src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"} alt="Admin Avatar" className="w-full h-full object-cover mix-blend-lighten" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{user?.name || "System Admin"}</h3>
            <p className="text-sm text-white/50 mb-4">{user?.email || "admin@wecan.com"}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              role === 'Super Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {role}
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 shadow-2xl border border-white/10">
             <h4 className="font-bold text-white mb-4 flex items-center gap-2">
               <SettingsIcon className="w-5 h-5 text-white/40" /> System Preferences
             </h4>
             <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-bold text-white/60 uppercase flex items-center gap-2 mb-2 tracking-wider">
                   <Globe className="w-4 h-4" /> Interface Language
                 </label>
                 <select 
                   value={user?.adminPreferences?.language || 'English'} 
                   onChange={(e) => updateProfile({ adminPreferences: { ...user?.adminPreferences, language: e.target.value as any } as any })}
                   className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm font-medium text-white transition-all"
                 >
                   <option value="English">English</option>
                   <option value="Khmer">Khmer (ភាសាខ្មែរ)</option>
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-bold text-white/60 uppercase flex items-center gap-2 mb-2 tracking-wider">
                   <Moon className="w-4 h-4" /> Theme Mode
                 </label>
                 <select 
                   value={user?.adminPreferences?.theme || 'Light'} 
                   onChange={(e) => updateProfile({ adminPreferences: { ...user?.adminPreferences, theme: e.target.value as any } as any })}
                   className="w-full bg-[#16161a] border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-sm font-medium text-white transition-all"
                 >
                   <option value="Light">Light Mode</option>
                   <option value="Dark">Dark Mode</option>
                 </select>
               </div>
             </div>
          </div>

          {/* Notification Alerts */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 shadow-2xl border border-white/10">
             <h4 className="font-bold text-white mb-4 flex items-center gap-2">
               <Bell className="w-5 h-5 text-white/40" /> Job Notifications
             </h4>
             <div className="space-y-4">
               <ToggleRow 
                 label="New Orders Alert" 
                 checked={user?.adminPreferences?.alerts?.newOrder ?? true} 
                 onChange={() => updateProfile({ adminPreferences: { ...user?.adminPreferences, alerts: { ...user?.adminPreferences?.alerts, newOrder: !(user?.adminPreferences?.alerts?.newOrder ?? true) } } as any })} 
               />
               <ToggleRow 
                 label="Low Stock Alert" 
                 checked={user?.adminPreferences?.alerts?.lowStock ?? true} 
                 onChange={() => updateProfile({ adminPreferences: { ...user?.adminPreferences, alerts: { ...user?.adminPreferences?.alerts, lowStock: !(user?.adminPreferences?.alerts?.lowStock ?? true) } } as any })} 
               />
               <ToggleRow 
                 label="Return Requests Alert" 
                 checked={user?.adminPreferences?.alerts?.returnRequest ?? true} 
                 onChange={() => updateProfile({ adminPreferences: { ...user?.adminPreferences, alerts: { ...user?.adminPreferences?.alerts, returnRequest: !(user?.adminPreferences?.alerts?.returnRequest ?? true) } } as any })} 
               />
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Security & Logs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Security & Authentication */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 lg:p-8 shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" /> Security & Authentication
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                 <div className="flex justify-between items-start mb-4">
                   <div className="bg-[#16161a] border border-white/10 p-3 rounded-xl shadow-sm text-white"><Key className="w-6 h-6" /></div>
                 </div>
                 <h4 className="font-bold text-white mb-1">Account Password</h4>
                 <p className="text-[11px] text-white/50 mb-4">Last changed 3 months ago.</p>
                 <button onClick={() => setShowPasswordModal(true)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                   Change Password
                 </button>
               </div>
               
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 opacity-5"><Smartphone className="w-32 h-32" /></div>
                 <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className={`p-3 rounded-xl shadow-sm text-white border ${twoFactorEnabled ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
                     {twoFactorEnabled ? <Shield className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                   </div>
                 </div>
                 <h4 className="font-bold text-white mb-1 relative z-10">Two-Factor Auth (2FA)</h4>
                 <p className="text-[11px] text-white/50 mb-4 relative z-10">{twoFactorEnabled ? "Your account is highly secure." : "Protect account via Telegram/App."}</p>
                 <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} className={`w-full relative z-10 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${twoFactorEnabled ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-white text-black hover:bg-gray-200 border-transparent'}`}>
                   {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA (Google Auth)'}
                 </button>
               </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h4 className="font-bold text-white mb-4">Active Sessions</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#16161a] border border-emerald-500/20 p-2.5 rounded-lg shadow-sm text-emerald-400"><Monitor className="w-5 h-5"/></div>
                     <div>
                       <p className="font-bold text-sm text-white">Windows PC - Chrome</p>
                       <p className="text-xs text-white/50">Phnom Penh, KH • IP: 114.120.33.22</p>
                     </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider">Current</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-4">
                     <div className="bg-[#16161a] border border-white/10 p-2.5 rounded-lg shadow-sm text-white/60"><Smartphone className="w-5 h-5"/></div>
                     <div>
                       <p className="font-bold text-sm text-white">iPhone 14 Pro - Safari</p>
                       <p className="text-xs text-white/50">Siem Reap, KH • IP: 27.109.11.5</p>
                     </div>
                  </div>
                  <button className="text-xs font-bold text-red-400 hover:text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors">Revoke</button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[24px] p-6 lg:p-8 shadow-2xl border border-white/10">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <History className="w-6 h-6 text-blue-500" /> Audit Trail / Activity Logs
               </h3>
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/50" />
                 <input type="text" placeholder="Search logs..." className="bg-[#16161a] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 text-white transition-all w-32 md:w-auto" />
               </div>
             </div>
             
             <div className="relative border-l-2 border-white/10 ml-4 space-y-6">
               {mockActivityLogs.map(log => (
                 <div key={log.id} className="relative pl-6">
                   <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[#1c1c21] shadow-sm ${
                     log.type === 'update' ? 'bg-blue-500' : 
                     log.type === 'order' ? 'bg-emerald-500' : 
                     log.type === 'security' ? 'bg-red-500' : 'bg-purple-500'
                   }`}></div>
                   <p className="text-sm font-bold text-white mb-0.5">{log.action}</p>
                   <p className="text-[10px] uppercase tracking-wider font-bold text-white/40">{log.time}</p>
                 </div>
               ))}
             </div>
             <button className="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-medium text-sm py-2.5 rounded-xl transition-colors border border-white/10">
               Load More Activities
             </button>
          </div>

        </div>
      </div>
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#16161a] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
            <div className="space-y-4 mb-6">
              <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 focus:border-blue-500 px-4 py-3 rounded-xl outline-none text-sm text-white" />
              <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 focus:border-blue-500 px-4 py-3 rounded-xl outline-none text-sm text-white" />
              <input type="password" placeholder="Confirm Password" className="w-full bg-white/5 border border-white/10 focus:border-blue-500 px-4 py-3 rounded-xl outline-none text-sm text-white" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 rounded-xl font-medium text-sm text-gray-400 bg-white/5 hover:bg-white/10 border border-transparent transition-colors">Cancel</button>
              <button onClick={() => { setShowPasswordModal(false); alert("Password updated successfully!"); }} className="flex-1 py-3 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 border border-blue-500/50">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Helpers
const SettingsIcon = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const Monitor = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" x2="16" y1="21" y2="21"></line><line x1="12" x2="12" y1="17" y2="21"></line></svg>;

function ToggleRow({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="font-bold text-white text-sm">{label}</h4>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-11 h-6 bg-[#16161a] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
