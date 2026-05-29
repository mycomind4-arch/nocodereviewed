import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Wrench, FileText, Users, BarChart3, Settings,
  Megaphone, LogOut, Menu, X, TrendingUp, TrendingDown, Eye,
  MousePointer, Mail, Clock, Star,
  Search, Plus, Edit, Trash2, AlertTriangle
} from 'lucide-react';
import { useAdminStore } from '@/stores/useStore';
import { adminStats, engineStatuses, tools, articles, subscribers, sponsoredSlots } from '@/data/mockData';

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'articles', label: 'Articles', icon: FileText },
  { key: 'subscribers', label: 'Subscribers', icon: Mail },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'sponsored', label: 'Sponsored Slots', icon: Megaphone },
  { key: 'settings', label: 'Settings', icon: Settings },
];

function StatCard({ title, value, change, positive, icon: Icon }: {
  title: string; value: string; change: string; positive: boolean; icon: LucideIcon;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-[#C8FF2F]" />
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/50">{title}</div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tools" value={adminStats.totalTools.toString()} change="+12%" positive={true} icon={Wrench} />
        <StatCard title="Published Articles" value={adminStats.publishedArticles.toString()} change="+8%" positive={true} icon={FileText} />
        <StatCard title="Active Subscribers" value={adminStats.activeSubscribers.toLocaleString()} change="+15%" positive={true} icon={Users} />
        <StatCard title="Clicks (30d)" value={adminStats.affiliateClicks30d.toLocaleString()} change="+23%" positive={true} icon={MousePointer} />
      </div>

      {/* Engine Status */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Autonomous Engines</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {engineStatuses.map((engine) => (
            <div key={engine.name} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{engine.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  engine.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                  engine.status === 'paused' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {engine.status}
                </span>
              </div>
              <div className="text-xs text-white/40 space-y-1">
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last: {new Date(engine.lastRun).toLocaleDateString()}</div>
                <div className="flex items-center gap-1">Next: {new Date(engine.nextRun).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/5">
          {[
            { action: 'Article published', detail: 'Lovable Review 2026', time: '2 hours ago', icon: FileText },
            { action: 'New subscriber', detail: 'sarah@example.com', time: '4 hours ago', icon: Mail },
            { action: 'Affiliate click', detail: 'Webflow - Homepage', time: '5 hours ago', icon: MousePointer },
            { action: 'Tool updated', detail: 'Framer - New pricing', time: '1 day ago', icon: Wrench },
            { action: 'Comparison published', detail: 'Webflow vs Framer', time: '2 days ago', icon: FileText },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-8 h-8 rounded-lg bg-[#C8FF2F]/10 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-[#C8FF2F]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{item.action}</div>
                <div className="text-xs text-white/50 truncate">{item.detail}</div>
              </div>
              <div className="text-xs text-white/30 shrink-0">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolsTab() {
  const [search, setSearch] = useState('');
  const filtered = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : tools;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">All Tools</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full sm:w-56 bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8FF2F] text-[#012A38] text-sm font-semibold hover:bg-[#a8df0f] transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Tool</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-white/50 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((tool) => (
                <tr key={tool.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f3ede4] flex items-center justify-center overflow-hidden shrink-0">
                        <img src={tool.imageUrl} alt={tool.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{tool.name}</div>
                        <div className="text-xs text-white/40">{tool.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tool.category.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-white/5 text-white/50 text-xs rounded-full capitalize">{c.replace('-', ' ')}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#C8FF2F] fill-[#C8FF2F]" />
                      <span className="text-sm text-white">{tool.ratingOverall}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full font-medium">Published</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ArticlesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">All Articles</h3>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8FF2F] text-[#012A38] text-sm font-semibold hover:bg-[#a8df0f] transition-colors">
          <Plus className="w-4 h-4" /> Write Article
        </button>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Title</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Views</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-white/50 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-white max-w-xs truncate">{article.title}</div>
                    <div className="text-xs text-white/40">{article.category}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-white/5 text-white/60 text-xs rounded-full capitalize">{article.articleType}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                      article.status === 'draft' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{article.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/60">{article.viewCount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubscribersTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Newsletter Subscribers</h3>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Source</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-sm text-white">{sub.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      sub.confirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{sub.confirmed ? 'Confirmed' : 'Pending'}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/60">{sub.source}</td>
                  <td className="px-5 py-4 text-sm text-white/40">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Page Views (30d)', value: '48.2K', change: '+12%', icon: Eye },
          { label: 'Affiliate Clicks', value: '342', change: '+23%', icon: MousePointer },
          { label: 'Newsletter Opens', value: '62%', change: '+5%', icon: Mail },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className="w-5 h-5 text-[#C8FF2F]" />
              <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/50">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-sm font-medium text-white mb-4">Top Performing Pages</h4>
        <div className="space-y-3">
          {[
            { page: '/blog/best-no-code-ai-builders', views: '8,950', trend: 'up' },
            { page: '/compare/webflow-vs-framer', views: '5,180', trend: 'up' },
            { page: '/tools/lovable', views: '3,420', trend: 'up' },
            { page: '/blog/webflow-seo-guide', views: '6,230', trend: 'down' },
            { page: '/tools/webflow', views: '4,850', trend: 'up' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-white/70">{item.page}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white font-medium">{item.views}</span>
                {item.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SponsoredTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Sponsored Slots</h3>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8FF2F] text-[#012A38] text-sm font-semibold hover:bg-[#a8df0f] transition-colors">
          <Plus className="w-4 h-4" /> Add Slot
        </button>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Slot</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Tool</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Fee</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-white/50 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sponsoredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 text-sm text-white">{slot.slotName}</td>
                  <td className="px-5 py-4 text-sm text-white/60">{tools.find(t => t.id === slot.toolId)?.name || slot.toolId}</td>
                  <td className="px-5 py-4 text-sm text-white/60">{slot.startDate} to {slot.endDate}</td>
                  <td className="px-5 py-4 text-sm text-white">${slot.monthlyFee}/mo</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      slot.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>{slot.active ? 'Active' : 'Expired'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-8 max-w-2xl">
      <h3 className="text-lg font-semibold text-white">Site Settings</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Site Name</label>
          <input defaultValue="No-Code Reviews"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Tagline</label>
          <input defaultValue="Honest reviews of no-code platforms"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Default Meta Description</label>
          <textarea defaultValue="In-depth, independent reviews of the best no-code platforms. Compare website builders, app makers, ecommerce tools, and more."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50 h-24 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Affiliate Disclosure Text</label>
          <textarea defaultValue="Some links on this page are affiliate links. This does not affect our editorial independence."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#C8FF2F]/50 h-24 resize-none" />
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-400/80">These settings are saved locally. In production, they sync to Supabase.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAuthenticated, activeTab, setActiveTab, login, logout, sidebarOpen, setSidebarOpen } = useAdminStore();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  if (!isAuthenticated) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (password === 'admin') { login(); setLoginError(false); }
      else { setLoginError(true); }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#012A38]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-4"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-white/50">Enter password to access the dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError(false); }}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C8FF2F]/50" />
            {loginError && <p className="text-sm text-red-400">Incorrect password. Try &quot;admin&quot;.</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#C8FF2F] text-[#012A38] font-semibold hover:bg-[#a8df0f] transition-colors">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'tools': return <ToolsTab />;
      case 'articles': return <ArticlesTab />;
      case 'subscribers': return <SubscribersTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'sponsored': return <SponsoredTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#012A38] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-[#011A24] border-r border-white/10 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-64'
      } ${sidebarOpen ? 'w-64' : 'lg:w-16'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className={`font-bold text-white ${!sidebarOpen ? 'lg:hidden' : ''}`}>No-Code Admin</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-1.5 text-white/60 hover:text-white">
            <Menu className="w-4 h-4" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'bg-[#C8FF2F]/10 text-[#C8FF2F]'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className={!sidebarOpen ? 'lg:hidden' : ''}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 bg-[#012A38]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-white/60 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-white">Admin Dashboard</span>
          <div className="w-9" />
        </div>
        <div className="p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {sidebarItems.find(i => i.key === activeTab)?.label || 'Overview'}
          </h2>
          {renderTab()}
        </div>
      </main>
    </div>
  );
}
