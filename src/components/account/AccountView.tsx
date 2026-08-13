import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Zap,
  HardDrive,
  Key,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
  Activity,
  Terminal,
  RefreshCcw,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { subscriptionService } from '../../services/subscriptionService';
import { aiService } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import { UserProfile, Entitlements, UsageInfo } from '../../types/auth';

interface AccountViewProps {
  onOpenUpgradeModal: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onOpenUpgradeModal }) => {
  const { t, isRTL, language, setLanguage } = useLanguage();

  const [user, setUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [entitlements, setEntitlements] = useState<Entitlements>(authService.getEntitlements());
  const [usage, setUsage] = useState<UsageInfo | null>(authService.getUsage());

  const [activeTab, setActiveTab] = useState<'profile' | 'sub' | 'usage' | 'security' | 'dev'>('profile');

  // Edit Profile fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Beginner');
  const [favoriteGenre, setFavoriteGenre] = useState(user?.favoriteGenre || 'Psytrance');
  const [learningGoal, setLearningGoal] = useState(user?.learningGoal || 'Master Ableton Live 12');

  // Change Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Diagnostics
  const [ollamaStatus, setOllamaStatus] = useState<string>('Checking...');
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    const unsub = authService.subscribe((_state, u) => {
      setUser(u);
      setEntitlements(authService.getEntitlements());
      setUsage(authService.getUsage());
      if (u) {
        setDisplayName(u.displayName);
        setExperienceLevel(u.experienceLevel);
        setFavoriteGenre(u.favoriteGenre);
        setLearningGoal(u.learningGoal);
      }
    });

    aiService.testLocalConnection().then((res) => {
      setOllamaStatus(res.ok ? 'CONNECTED (Local Ollama Online)' : 'NOT CONNECTED (Offline)');
    });

    return () => unsub();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);

    const res = await authService.updateProfile({
      displayName,
      experienceLevel,
      favoriteGenre,
      learningGoal,
    });

    setSaving(false);
    if (res.ok) {
      setMsg('Profile updated successfully.');
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    setSaving(true);
    setMsg(null);
    setError(null);

    const res = await authService.changePassword(oldPassword, newPassword);
    setSaving(false);

    if (res.ok) {
      setMsg('Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
    } else {
      setError(res.error || 'Failed to change password.');
    }
  };

  const handleExportData = async () => {
    const data = await authService.exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AAMC_Export_${user?.email || 'user'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    await authService.deleteAccount();
    setDeleteLoading(false);
    setIsDeleteOpen(false);
  };

  const handleSimulateWebhook = async (action: 'checkout' | 'cancel' | 'past_due') => {
    if (!user) return;
    setSimLoading(true);
    try {
      const res = await fetch('/api/payments/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          plan: 'pro_monthly',
          action: action === 'checkout' ? 'completed' : action,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        await authService.initSession();
      }
    } catch {}
    setSimLoading(false);
  };

  const isPro = subscriptionService.isPro();

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-[#1C1C1C] border border-[#333] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#252525] border border-[#3A3A3A] flex items-center justify-center text-[#90FF00] font-bold text-xl shadow-inner shrink-0">
            {user?.displayName?.charAt(0).toUpperCase() || 'P'}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white font-mono">{user?.displayName || 'Producer'}</h1>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isPro ? 'bg-[#90FF00] text-black' : 'bg-[#333] text-gray-300'
                }`}
              >
                {isPro ? t('sub.proActive') : t('sub.freePlan')}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">{user?.email || 'guest@aamc.local'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isPro ? (
            <button
              onClick={onOpenUpgradeModal}
              className="py-2.5 px-4 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-xl flex items-center gap-2 transition-transform cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{t('sub.upgradeBtn')}</span>
            </button>
          ) : (
            <button
              onClick={() => subscriptionService.manageSubscription().then((r) => r.portalUrl && (window.location.href = r.portalUrl))}
              className="py-2.5 px-4 bg-[#282828] hover:bg-[#333] border border-[#444] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
              <span>{t('sub.manageSubBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-[#252525] text-white border border-[#444]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{t('account.profileTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('sub')}
          className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'sub' ? 'bg-[#252525] text-white border border-[#444]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#90FF00]" />
          <span>{t('account.subTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('usage')}
          className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'usage' ? 'bg-[#252525] text-white border border-[#444]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>{t('account.usageTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-[#252525] text-white border border-[#444]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{t('account.securityTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('dev')}
          className={`py-2 px-4 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'dev' ? 'bg-[#222218] text-[#90FF00] border border-[#90FF00]/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-[#90FF00]" />
          <span>Dev Diagnostics</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-[#90FF00]/10 border border-[#90FF00]/30 rounded-lg flex items-center gap-2 text-xs text-[#90FF00]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-lg flex items-center gap-2 text-xs text-[#FF8888]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">{t('auth.displayNameLabel')}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-[#90FF00] text-white text-sm rounded-lg py-2 px-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">{t('auth.emailLabel')}</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-[#111] border border-[#222] text-gray-400 text-sm rounded-lg py-2 px-3 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">{t('auth.experienceLabel')}</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2 px-3 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">{t('auth.genreLabel')}</label>
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2 px-3 outline-none"
              >
                <option value="Psytrance">Psytrance</option>
                <option value="Techno">Techno</option>
                <option value="Melodic Techno">Melodic Techno</option>
                <option value="Goa">Goa Trance</option>
                <option value="Progressive">Progressive</option>
                <option value="EDM">EDM</option>
                <option value="Ambient">Ambient</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">{t('auth.goalLabel')}</label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="e.g. Master Ableton Live 12 Operator and release a Psytrance EP"
              className="w-full bg-[#141414] border border-[#333] text-white text-xs rounded-lg py-2 px-3 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>{t('common.save')}</span>
          </button>
        </form>
      )}

      {/* TAB 2: SUBSCRIPTION */}
      {activeTab === 'sub' && (
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-gray-400 block">{t('sub.currentPlan')}</span>
              <h3 className="text-lg font-bold text-white uppercase font-mono">{user?.subscriptionPlan || 'FREE'}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                isPro ? 'bg-[#90FF00]/20 text-[#90FF00] border border-[#90FF00]/40' : 'bg-[#333] text-gray-300'
              }`}
            >
              {user?.subscriptionStatus || 'active'}
            </span>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase mb-3">Active Plan Entitlements:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(entitlements).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between p-2.5 bg-[#141414] rounded-lg border border-[#222]">
                  <span className="text-gray-300 font-mono capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`font-bold ${val ? 'text-[#90FF00]' : 'text-gray-500'}`}>
                    {val ? 'ALLOWED' : 'PRO ONLY'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!isPro ? (
            <button
              onClick={onOpenUpgradeModal}
              className="w-full py-3 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{t('sub.upgradeBtn')}</span>
            </button>
          ) : (
            <button
              onClick={() => subscriptionService.manageSubscription().then((r) => r.portalUrl && (window.location.href = r.portalUrl))}
              className="py-2.5 px-4 bg-[#252525] hover:bg-[#303030] text-white border border-[#444] font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
              <span>{t('sub.manageSubBtn')}</span>
            </button>
          )}
        </div>
      )}

      {/* TAB 3: USAGE */}
      {activeTab === 'usage' && (
        <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00E5FF]" />
            <span>{t('usage.title')}</span>
          </h3>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4">
            <div className="flex justify-between items-center text-xs font-mono text-gray-300 mb-2">
              <span>{t('usage.cloudAiCount')}</span>
              <span className="font-bold text-white">
                {usage?.aiCloudRequestsCount || 0} / {usage?.aiCloudRequestsLimit || 15}
              </span>
            </div>

            <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#90FF00] transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    ((usage?.aiCloudRequestsCount || 0) / (usage?.aiCloudRequestsLimit || 15)) * 100
                  )}%`,
                }}
              />
            </div>

            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              {t('usage.unlimitedLocal')}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & EXPORT */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {!user?.isGuest && (
            <form onSubmit={handleChangePassword} className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-white mb-2">Change Password</h3>
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] text-white text-sm rounded-lg py-2 px-3 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] text-white text-sm rounded-lg py-2 px-3 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="py-2 px-4 bg-[#282828] hover:bg-[#333] text-white border border-[#444] font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Update Password</span>
              </button>
            </form>
          )}

          <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono mb-1">{t('account.exportBtn')}</h3>
              <p className="text-xs text-gray-400">Download a JSON copy of your profile, learning progress, and AI memory.</p>
            </div>
            <button
              onClick={handleExportData}
              className="py-2.5 px-4 bg-[#252525] hover:bg-[#303030] text-white border border-[#444] font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-[#90FF00]" />
              <span>{t('account.exportBtn')}</span>
            </button>
          </div>

          <div className="bg-[#201414] border border-[#442222] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#FF8888] font-mono mb-1">{t('account.deleteBtn')}</h3>
              <p className="text-xs text-gray-400">{t('account.deleteConfirmDesc')}</p>
            </div>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="py-2.5 px-4 bg-[#441111] hover:bg-[#551111] text-[#FF8888] font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('account.deleteBtn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: DEV DIAGNOSTICS */}
      {activeTab === 'dev' && (
        <div className="bg-[#141414] border border-[#90FF00]/30 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-[#90FF00] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>Developer Diagnostics & Test Simulation Layer</span>
            </h3>
            <span className="text-[10px] font-mono bg-[#90FF00]/20 text-[#90FF00] px-2 py-0.5 rounded">DEV MODE ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#1B1B1B] border border-[#2D2D2D] rounded-lg">
              <span className="text-gray-400 block mb-1">User ID:</span>
              <span className="text-white font-bold">{user?.userId || 'Guest'}</span>
            </div>
            <div className="p-3 bg-[#1B1B1B] border border-[#2D2D2D] rounded-lg">
              <span className="text-gray-400 block mb-1">Plan / Status:</span>
              <span className="text-[#90FF00] font-bold">{user?.subscriptionPlan} ({user?.subscriptionStatus})</span>
            </div>
            <div className="p-3 bg-[#1B1B1B] border border-[#2D2D2D] rounded-lg">
              <span className="text-gray-400 block mb-1">Ollama Status:</span>
              <span className="text-[#00E5FF] font-bold">{ollamaStatus}</span>
            </div>
            <div className="p-3 bg-[#1B1B1B] border border-[#2D2D2D] rounded-lg">
              <span className="text-gray-400 block mb-1">Auth State:</span>
              <span className="text-white font-bold">{authService.getAuthState()}</span>
            </div>
          </div>

          <div className="border-t border-[#2A2A2A] pt-4">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase mb-3">Simulate Payment Webhooks (Test Matrix):</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateWebhook('checkout')}
                disabled={simLoading}
                className="py-2 px-3 bg-[#90FF00] hover:bg-[#80EE00] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                {simLoading ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Simulate Pro Checkout</span>
              </button>

              <button
                onClick={() => handleSimulateWebhook('past_due')}
                disabled={simLoading}
                className="py-2 px-3 bg-[#FFB700] hover:bg-[#E5A300] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Simulate Past Due</span>
              </button>

              <button
                onClick={() => handleSimulateWebhook('cancel')}
                disabled={simLoading}
                className="py-2 px-3 bg-[#333] hover:bg-[#444] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>Simulate Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E1E1E] border border-[#442222] rounded-xl p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-[#FF5555] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-mono mb-2">{t('account.deleteConfirmTitle')}</h3>
            <p className="text-xs text-gray-300 mb-6">{t('account.deleteConfirmDesc')}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="py-2 px-4 bg-[#252525] hover:bg-[#303030] text-gray-300 text-xs rounded-lg cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="py-2 px-4 bg-[#FF5555] hover:bg-[#E04444] text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
