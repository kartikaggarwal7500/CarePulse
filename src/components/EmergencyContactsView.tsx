import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Plus,
  Trash2,
  HeartPulse,
  Radio,
  Building,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { EmergencyContact } from '../types';
import { DEFAULT_EMERGENCY_CONTACTS } from '../data/firstAidData';

interface EmergencyContactsViewProps {
  onOpenSos: () => void;
}

export const EmergencyContactsView: React.FC<EmergencyContactsViewProps> = ({
  onOpenSos,
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem('safeaid_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_EMERGENCY_CONTACTS;
      }
    }
    return DEFAULT_EMERGENCY_CONTACTS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedContactForCall, setSelectedContactForCall] = useState<EmergencyContact | null>(null);

  useEffect(() => {
    localStorage.setItem('safeaid_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Personal Emergency Contact',
      phone: newPhone.trim(),
      type: 'trusted',
      availableHours: 'Personal / Direct',
      avatarIcon: 'UserCheck',
      isDefault: false,
    };

    setContacts((prev) => [...prev, newContact]);
    setNewName('');
    setNewRole('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleInitiateCall = (contact: EmergencyContact) => {
    setSelectedContactForCall(contact);
  };

  const confirmAndDial = () => {
    if (selectedContactForCall) {
      window.location.href = `tel:${selectedContactForCall.phone.replace(/[^0-9+]/g, '')}`;
      setSelectedContactForCall(null);
    }
  };

  const getContactIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-5 h-5 text-red-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-cyan-600" />;
      case 'Building':
        return <Building className="w-5 h-5 text-indigo-600" />;
      default:
        return <UserCheck className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner (Clean Light Style) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-white via-red-50/30 to-slate-50 text-slate-900 shadow-2xs border border-slate-200/90 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/70 text-red-800 text-xs font-bold uppercase tracking-wider border border-red-200">
            <Radio className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Emergency Contacts
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            One-touch verified numbers for Universal Emergency Services, Campus Police Dispatch, Student Health Clinic, and Trusted Contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-cyan-600" />
            <span>Add Contact</span>
          </button>

          <button
            onClick={onOpenSos}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Trigger SOS Alert</span>
          </button>
        </div>
      </div>

      {/* Contacts List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              contact.type === 'emergency'
                ? 'bg-white border-red-200 shadow-2xs'
                : 'bg-white border-slate-200/90 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      contact.type === 'emergency'
                        ? 'bg-red-50 border border-red-100'
                        : 'bg-cyan-50 border border-cyan-100'
                    }`}
                  >
                    {getContactIcon(contact.avatarIcon)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {contact.role}
                    </p>
                  </div>
                </div>

                {!contact.isDefault && (
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete contact"
                    aria-label="Delete contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Hours / details */}
              <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>{contact.availableHours}</span>
              </div>
            </div>

            {/* Bottom Call Action */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-800">
                {contact.phone}
              </span>

              <button
                onClick={() => handleInitiateCall(contact)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  contact.type === 'emergency'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                }`}
                aria-label={`Call ${contact.name} at ${contact.phone}`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call Confirmation Dialog */}
      {selectedContactForCall && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>

            <h3 className="text-lg font-black text-slate-900">
              Confirm Voice Call
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Are you sure you want to dial <strong>{selectedContactForCall.name}</strong> at{' '}
              <span className="font-mono font-bold">{selectedContactForCall.phone}</span>?
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                onClick={() => setSelectedContactForCall(null)}
                className="w-1/2 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndDial}
                className="w-1/2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-2xs"
              >
                Initiate Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Contact Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-xl text-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                Add Trusted Emergency Contact
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomContact} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Roommate / Mom / Dorm RA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/30 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Relationship</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Dorm RA, Family Member"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/30 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. (555) 123-4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/30 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-2xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
