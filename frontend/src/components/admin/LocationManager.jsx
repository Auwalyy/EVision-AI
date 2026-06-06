import { useState } from 'react';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
import { createLocation, updateLocation, deleteLocation } from '../../utils/api';

const emptyForm = {
  name: '', city: '', state: '', latitude: '', longitude: '',
  populationDensity: 50, trafficVolume: 50, commercialScore: 50, evScore: 30,
  hasExistingStation: false, stationType: 'none',
};

export default function LocationManager({ locations = [], onRefresh }) {
  const [editing, setEditing] = useState(null); // null | 'new' | locationId
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const startAdd = () => { setEditing('new'); setForm(emptyForm); setError(''); };
  const startEdit = (loc) => { setEditing(loc._id); setForm({ ...loc }); setError(''); };
  const cancel = () => { setEditing(null); setError(''); };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') {
        await createLocation({ ...form, latitude: +form.latitude, longitude: +form.longitude });
      } else {
        await updateLocation(editing, { ...form, latitude: +form.latitude, longitude: +form.longitude });
      }
      setEditing(null);
      onRefresh?.();
    } catch (err) {
      setError(err?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this location?')) return;
    try {
      await deleteLocation(id);
      onRefresh?.();
    } catch {
      alert('Delete failed');
    }
  };

  const field = (key, label, type = 'text') => (
    <div>
      <label className="text-ev-gray text-xs block mb-1">{label}</label>
      {key === 'hasExistingStation' ? (
        <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-ev-blue" />
      ) : key === 'stationType' ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full bg-ev-dark border border-ev-dark-border rounded-lg px-3 py-2 text-white text-sm">
          {['none', 'level1', 'level2', 'dcfast'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full bg-ev-dark border border-ev-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-ev-blue outline-none" />
      )}
    </div>
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Location Management</h3>
        <button onClick={startAdd} className="btn-primary text-sm py-1.5">
          <Plus size={15} /> Add Location
        </button>
      </div>

      {editing && (
        <div className="mb-4 p-4 bg-ev-dark rounded-xl border border-ev-blue/30">
          <p className="text-ev-blue font-medium text-sm mb-3">{editing === 'new' ? 'Add New Location' : 'Edit Location'}</p>
          <div className="grid grid-cols-2 gap-3">
            {field('name', 'Name')}
            {field('city', 'City')}
            {field('state', 'State')}
            {field('latitude', 'Latitude', 'number')}
            {field('longitude', 'Longitude', 'number')}
            {field('populationDensity', 'Population Density (0-100)', 'number')}
            {field('trafficVolume', 'Traffic Volume (0-100)', 'number')}
            {field('commercialScore', 'Commercial Score (0-100)', 'number')}
            {field('evScore', 'EV Adoption Score (0-100)', 'number')}
            {field('stationType', 'Station Type')}
            {field('hasExistingStation', 'Has Existing Station')}
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button onClick={save} disabled={saving} className="btn-primary text-sm py-1.5">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel} className="btn-secondary text-sm py-1.5">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-ev-dark-card">
            <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
              <th className="text-left pb-2">Name</th>
              <th className="text-left pb-2">City</th>
              <th className="text-right pb-2">Pop.</th>
              <th className="text-right pb-2">Traffic</th>
              <th className="text-right pb-2">Commercial</th>
              <th className="text-right pb-2">EV</th>
              <th className="text-center pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className="border-b border-ev-dark-border/40 hover:bg-ev-dark-border/20">
                <td className="py-2.5 text-white">{loc.name}</td>
                <td className="py-2.5 text-ev-gray">{loc.city}</td>
                <td className="py-2.5 text-right text-ev-gray">{loc.populationDensity}</td>
                <td className="py-2.5 text-right text-ev-gray">{loc.trafficVolume}</td>
                <td className="py-2.5 text-right text-ev-gray">{loc.commercialScore}</td>
                <td className="py-2.5 text-right text-ev-gray">{loc.evScore}</td>
                <td className="py-2.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => startEdit(loc)} className="text-ev-gray hover:text-ev-blue transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => remove(loc._id)} className="text-ev-gray hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
