import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
// import { Select } from '../common/Select';
import ReactSelect from 'react-select';
import { Property } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface Group {
  _id: string;
  name: string;
  properties: Property[];
  photo?: string;
}

const Groups: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupPhoto, setGroupPhoto] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch properties for selection
  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data.properties || []));
  }, []);

  // Fetch groups from backend
  const fetchGroups = async () => {
    const res = await fetch('/api/groups');
    const data = await res.json();
    if (data.success) setGroups(data.groups);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle group photo file input
  const handleGroupPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddGroup = async () => {
    setMessage(null);
    if (!groupName.trim()) {
      setMessage('Group name cannot be empty or only spaces.');
      return;
    }
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, properties: selectedProperties, photo: groupPhoto })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Group added successfully!');
        setShowForm(false);
        setGroupName('');
        setSelectedProperties([]);
        setGroupPhoto('');
        fetchGroups();
      } else {
        setMessage('Failed to add group.');
      }
    } catch (err) {
      setMessage('Error adding group.');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;
    const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setMessage('Group deleted successfully!');
      fetchGroups();
    } else {
      setMessage('Failed to delete group.');
    }
  };

  const formRef = useRef<HTMLDivElement>(null);
  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowForm(true);
    setGroupName(group.name);
    setSelectedProperties(group.properties.map(p => p._id).filter((id): id is string => !!id));
    setGroupPhoto((group as any).photo || '');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSaveEdit = async () => {
    if (!editingGroup) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/groups/${editingGroup._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, properties: selectedProperties, photo: groupPhoto })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Group updated successfully!');
        setShowForm(false);
        setGroupName('');
        setSelectedProperties([]);
        setGroupPhoto('');
        setEditingGroup(null);
        fetchGroups();
      } else {
        setMessage('Failed to update group.');
      }
    } catch (err) {
      setMessage('Error updating group.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Groups</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Group
        </Button>
      </div>
      {message && (
        <div className="mb-4 text-green-400">{message}</div>
      )}
      {showForm && (
        <Card className="mb-8">
          <div ref={formRef} className="flex flex-col gap-4">
            <Input label="Group Name" value={groupName} onChange={setGroupName} />
            <label className="text-gray-300 text-sm font-medium mb-1">Select Properties</label>
            <div className="flex flex-col gap-2">
              <ReactSelect
                isMulti
                options={properties.filter(p => p._id).map((p) => ({ value: p._id as string, label: p.name }))}
                value={properties.filter(p => selectedProperties.includes(p._id as string)).map(p => ({ value: p._id as string, label: p.name }))}
                onChange={opts => setSelectedProperties(Array.isArray(opts) ? opts.map(opt => opt.value) : [])}
                classNamePrefix="react-select"
                placeholder="Select properties..."
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: '#1f2937', // bg-gray-800
                    borderColor: state.isFocused ? '#ef4444' : '#374151', // focus:red-500, default:gray-700
                    minHeight: '40px',
                    color: '#fff',
                    boxShadow: state.isFocused ? '0 0 0 2px #ef4444' : undefined,
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937', // bg-gray-800
                    color: '#fff',
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#991b1b',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#991b1b',
                    ':hover': { backgroundColor: '#fecaca', color: '#b91c1c' },
                  }),
                  placeholder: (base) => ({ ...base, color: '#9ca3af' }),
                  singleValue: (base) => ({ ...base, color: '#fff' }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#991b1b' : state.isFocused ? '#374151' : '#1f2937',
                    color: '#fff',
                  }),
                }}
              />
            </div>
            <label className="text-gray-300 text-sm font-medium mb-1">Group Photo</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                className="bg-gray-800 text-white rounded p-2 w-48 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={handleGroupPhotoChange}
                style={{ color: 'white' }}
              />
              {groupPhoto && (
                <img src={groupPhoto} alt="Group Preview" className="w-16 h-16 object-cover rounded border border-gray-700" />
              )}
            </div>
            <div className="flex gap-2 mt-4">
              {editingGroup ? (
                <Button variant="primary" onClick={handleSaveEdit}>Update Group</Button>
              ) : (
                <Button variant="primary" onClick={handleAddGroup}>Save Group</Button>
              )}
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditingGroup(null); setGroupName(''); setSelectedProperties([]); setGroupPhoto(''); }}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Existing Groups</h2>
        <div className="mb-4 flex items-center">
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full max-w-xs"
          />
        </div>
        {groups.length === 0 ? (
          <div className="text-gray-400">No groups found.</div>
        ) : (
          <div className="space-y-4">
            {groups.filter(group =>
              group.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((group) => (
              <Card key={group._id} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {group.photo && (
                      <img src={group.photo} alt={group.name} className="w-10 h-10 object-cover rounded-full border border-gray-700" />
                    )}
                    <span className="font-bold text-white text-lg">{group.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEditGroup(group)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteGroup(group._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="text-gray-300 text-sm">
                  Properties: {group.properties.length === 0 ? 'None' : `${group.properties.length} added`}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups; 