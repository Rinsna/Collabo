import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Search, Filter, Calendar, 
  CreditCard, User, Building2, ExternalLink,
  CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  TrendingDown, TrendingUp, Wallet, ShieldCheck,
  Zap, ArrowRightLeft, MoreHorizontal, X,
  IndianRupee, Receipt, Landmark, Activity,
  ChevronRight, ArrowDownLeft, FileText, Lock
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('payments');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'payments') {
        const response = await api.get('/payments/admin/payments/');
        setPayments(response.data.results || response.data);
      } else {
        const response = await api.get('/payments/admin/payouts/');
        setPayouts(response.data.results || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.payer_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.payee_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.stripe_payment_intent_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collaboration_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayouts = payouts.filter(p => 
    p.user_username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.stripe_transfer_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'success': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'pending': case 'processing': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'failed': case 'refunded': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const totalVolume = payments.reduce((sum, p) => p.status === 'completed' ? sum + parseFloat(p.amount) : sum, 0);
  const totalFees = payments.reduce((sum, p) => p.status === 'completed' ? sum + parseFloat(p.platform_fee || 0) : sum, 0);

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handlePayoutClick = (payout) => {
    setSelectedPayout(payout);
    setIsPayoutModalOpen(true);
  };

  const handleSync = async () => {
    toast.promise(
      new Promise(async (resolve) => {
        await fetchData();
        setTimeout(resolve, 1000);
      }),
      {
        loading: 'Syncing Financial Ledger...',
        success: 'Financial data synchronized',
        error: 'Sync failed',
      },
      {
        style: {
          borderRadius: '16px',
          background: '#18181b',
          color: '#fff',
          fontWeight: '900',
          textTransform: 'uppercase',
          fontSize: '10px'
        }
      }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Financial Oversight</h2>
          <p className="text-gray-600 dark:text-gray-400">Ledger monitoring and global treasury control</p>
        </div>

        <div className="flex items-center space-x-3">
           <button 
             onClick={handleSync}
             className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all text-gray-400 hover:text-violet-500"
           >
             <Activity className="w-5 h-5" />
           </button>
           <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
             <button 
               onClick={() => setActiveSubTab('payments')}
               className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === 'payments' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               INFLOW
             </button>
             <button 
               onClick={() => setActiveSubTab('payouts')}
               className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeSubTab === 'payouts' ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               OUTFLOW
             </button>
           </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gross Volume</p>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹{totalVolume.toLocaleString()}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Rev (5%)</p>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">₹{totalFees.toLocaleString()}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Payouts</p>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">{payouts.filter(p => p.status === 'pending').length}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Success</p>
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">
            {payments.length > 0 ? `${Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)}%` : '0%'}
          </h4>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder={`Search unique ${activeSubTab} ID...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-violet-500 transition-all font-medium"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-all uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              <span>Statement Date</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Data...</p>
          </div>
        ) : activeSubTab === 'payments' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ledger ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount & Net</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contract Parties</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredPayments.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => handlePaymentClick(p)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm border border-violet-200 dark:border-violet-700">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">TXN_{p.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold truncate max-w-[120px] uppercase">ID: {p.stripe_payment_intent_id?.slice(-8) || 'PLATFORM_TX'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-900 dark:text-white">₹{parseFloat(p.amount).toLocaleString()}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black mt-0.5 uppercase tracking-widest">Net: ₹{parseFloat(p.net_amount).toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-[10px] font-black">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-900 dark:text-white uppercase truncate max-w-[100px]">{p.payer_username}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-black">
                          <User className="w-3.5 h-3.5 text-violet-500" />
                          <span className="text-gray-900 dark:text-white uppercase truncate max-w-[100px]">{p.payee_username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(p.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Finalized</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payout ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Funds</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Beneficiary</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {filteredPayouts.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => handlePayoutClick(p)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-700">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">PAY_{p.id}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Transfer Executed</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{parseFloat(p.amount).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-black mt-0.5 uppercase tracking-widest">Cleared Funds</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 font-black text-[10px]">
                          {p.user_username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase">{p.user_username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white">{new Date(p.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white flex justify-between items-center relative">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 <div className="flex items-center space-x-5 relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black">
                       ₹
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Financial Transaction</h3>
                      <p className="text-white/80 font-bold uppercase text-[10px] tracking-[0.2em]">Ref: {selectedPayment.stripe_payment_intent_id || 'LOCAL_DB_ENTRY'}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-600">
                       <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Gross Amount</p>
                       <p className="text-2xl font-black text-gray-900 dark:text-white">₹{parseFloat(selectedPayment.amount).toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800 text-emerald-600">
                       <p className="text-[10px] font-black uppercase mb-1">Tax / Fees</p>
                       <p className="text-2xl font-black">₹{parseFloat(selectedPayment.platform_fee).toLocaleString()}</p>
                    </div>
                 </div>

                 <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                       <ArrowRightLeft className="w-4 h-4 mr-2" />
                       Transaction Flow
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-600 space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                                <Building2 className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase">Payer Account</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{selectedPayment.payer_username}</p>
                             </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                          <div className="text-right">
                             <div className="flex items-center space-x-3 justify-end">
                                <div>
                                   <p className="text-[9px] font-black text-gray-400 uppercase">Settlement Account</p>
                                   <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{selectedPayment.payee_username}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600">
                                   <User className="w-6 h-6" />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <FileText className="w-6 h-6 text-blue-600" />
                       <div>
                          <p className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-tighter">{selectedPayment.collaboration_title}</p>
                          <p className="text-[10px] font-bold text-blue-600">Linked Campaign Asset</p>
                       </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-blue-400" />
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                    <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${getStatusColor(selectedPayment.status)}`}>
                       Status: {selectedPayment.status}
                    </span>
                    <button className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-gray-900/10">
                       Print Statement
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payout Detail Modal */}
      <AnimatePresence>
        {isPayoutModalOpen && selectedPayout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 bg-emerald-600 text-white flex justify-between items-center relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 <div className="flex items-center space-x-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black">
                       <ArrowUpRight className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">Payout Withdrawal</h3>
                      <p className="text-white/80 font-bold uppercase text-[9px] tracking-widest">ID: {selectedPayout.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsPayoutModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="text-center space-y-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Withdrawal Amount</p>
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">₹{parseFloat(selectedPayout.amount).toLocaleString()}</h2>
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-600 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-violet-600">
                          {selectedPayout.user_username.charAt(0).toUpperCase()}
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase">Creator</p>
                          <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{selectedPayout.user_username}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-gray-400 uppercase">Security Check</p>
                       <p className="text-xs font-black text-emerald-600 uppercase">Verified</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl">
                       <div className="flex items-center">
                          <Landmark className="w-4 h-4 mr-2" />
                          <span>Bank Account</span>
                       </div>
                       <span className="text-gray-900 dark:text-white font-black uppercase">Linked Standard (****8293)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl">
                       <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          <span>Gateway ID</span>
                       </div>
                       <span className="text-gray-900 dark:text-white font-black uppercase">{selectedPayout.stripe_transfer_id || 'INTERNAL_LEDGER'}</span>
                    </div>
                 </div>

                 <div className="flex flex-col space-y-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => {
                        toast.success('Funds released to payment gateway.');
                        setIsPayoutModalOpen(false);
                      }}
                      className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                    >
                       Approve & Release Funds
                    </button>
                    <button className="w-full py-5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                       Flag for Investigation
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;
