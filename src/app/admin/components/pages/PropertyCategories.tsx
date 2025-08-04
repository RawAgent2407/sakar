import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Category {
  _id?: string;
  name: string;
}

const PropertyCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  useEffect(() => {
    fetch('/api/property-categories')
      .then(res => res.json())
      .then(data => { if (data.success) setCategories(data.categories); });
  }, []);

  const handleAddCategory = async () => {
    setMessage(null);
    const trimmed = categoryName.trim();
    if (!trimmed || trimmed === '.' || /^\.+$/.test(trimmed)) {
      setMessage('Category name cannot be empty, only spaces, or only dots.');
      return;
    }
    try {
      const res = await fetch('/api/property-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();
      if (data.success) {
        setCategories([data.category, ...categories]);
        setShowForm(false);
        setCategoryName('');
        setMessage('Category added!');
      } else {
        setMessage('Failed to add category.');
      }
    } catch (err) {
      setMessage('Error adding category.');
    }
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    const trimmed = editingName.trim();
    if (!editingId || !trimmed || trimmed === '.' || /^\.+$/.test(trimmed)) {
      setMessage('Category name cannot be empty, only spaces, or only dots.');
      return;
    }
    setMessage(null);
    try {
      const res = await fetch('/api/property-categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, name: editingName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.map(cat => (cat._id === editingId ? data.category : cat)));
        setEditingId(null);
        setEditingName('');
        setMessage('Category updated!');
      } else {
        setMessage(data.message || 'Failed to update category.');
      }
    } catch (err) {
      setMessage('Error updating category.');
    }
  };

  const handleDelete = async (id: string) => {
    setMessage(null);
    try {
      const res = await fetch('/api/property-categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(cat => cat._id !== id));
        setMessage('Category deleted!');
      } else {
        setMessage(data.message || 'Failed to delete category.');
      }
    } catch (err) {
      setMessage('Error deleting category.');
    }
  };

  const isProtectedCategory = (name: string) => {
    return name === 'Commercial' || name === 'Residential';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Property Categories</h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Create Category
        </Button>
      </div>
      {message && <div className="mb-4 text-green-400">{message}</div>}
      {showForm && (
        <Card className="mb-8">
          <div className="flex flex-col gap-4">
            <Input label="Category Name" value={categoryName} onChange={setCategoryName} />
            <div className="flex gap-2 mt-4">
              <Button variant="primary" onClick={handleAddCategory}>Save Category</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setCategoryName(''); }}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Category Name</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id || cat.name} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4 text-white">
                    {editingId === cat._id ? (
                      <Input value={editingName} onChange={setEditingName} />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="py-4 px-4 text-center space-x-0">
                    {isProtectedCategory(cat.name) ? null : (
                      <>
                        <Button
                          variant="ghost"
                          className="p-1 hover:bg-gray-700 rounded"
                          onClick={() => handleDelete(cat._id!)}
                          aria-label="Delete category"
                        >
                          <FaTrash className="w-4 h-4 text-white" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PropertyCategories;
