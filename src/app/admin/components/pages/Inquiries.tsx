import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Calendar, Filter, Search, Eye, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

export const Inquiries: React.FC = () => {
  const { showToast } = useApp();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/inquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success) setInquiries(data.inquiries);
      });
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProperties(data.properties);
      });
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      (inquiry.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.phone || '').includes(searchTerm) ||
      (inquiry.propertyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || inquiry.status === filterStatus;
    const matchesSource = !filterSource || inquiry.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
        showToast(`Inquiry status updated to ${newStatus}`, 'success');
      } else {
        showToast(data.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleViewDetails = (id: string) => {
    showToast('Opening inquiry details...', 'info');
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/inquiries/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          // Update the local state to remove the deleted inquiry
          setInquiries(prevInquiries => prevInquiries.filter(inquiry => inquiry._id !== id));
          showToast('Inquiry deleted successfully', 'success');
        } else {
          throw new Error(data.message || 'Failed to delete inquiry');
        }
      } catch (error) {
        console.error('Error deleting inquiry:', error);
        showToast(error.message || 'Failed to delete inquiry', 'error');
      }
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'closed', label: 'Closed' },
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'walk-in', label: 'Walk-in' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="info" size="sm">New</Badge>;
      case 'contacted':
        return <Badge variant="warning" size="sm">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="success" size="sm">Qualified</Badge>;
      case 'closed':
        return <Badge variant="error" size="sm">Closed</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'contacted':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'qualified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    {
      title: 'Total Inquiries',
      value: inquiries.length.toString(),
      icon: MessageSquare,
      color: 'text-blue-400',
      bg: 'bg-black/30',
    },
    {
      title: 'New Inquiries',
      value: inquiries.filter(i => i.status === 'new').length.toString(),
      icon: AlertCircle,
      color: 'text-yellow-400',
      bg: 'bg-black/30',
    },
    {
      title: 'Qualified Leads',
      value: inquiries.filter(i => i.status === 'qualified').length.toString(),
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-black/30',
    },
    {
      title: 'Closed Inquiries',
      value: inquiries.filter(i => i.status === 'closed').length.toString(),
      icon: Clock,
      color: 'text-gray-400',
      bg: 'bg-black/30',
    },
  ];

  const getPropertyName = (propertyId: string) => {
    if (!propertyId) return null;
    const property = properties.find((p) => p._id === propertyId);
    return property ? property.name : null;
  };

  return (
    <div className="p-8 min-h-screen bg-black">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Inquiries</h1>
        <p className="text-gray-400">Manage customer inquiries and leads</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`relative overflow-hidden ${stat.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-black/30 ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </Card>

      {/* Inquiries List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Contact</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Property Type</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Property Name</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map((inquiry) => (
                <tr key={inquiry._id || inquiry.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-white">{inquiry.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{inquiry.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{inquiry.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white">{inquiry.propertyType || '-'}</span>
                  </td>
                  <td className="py-4 px-4">
                    {getPropertyName(inquiry.propertyId) ? (
                      <span className="text-white">{getPropertyName(inquiry.propertyId)}</span>
                    ) : (
                      <span className="text-gray-400">General Inquiry</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-400 text-sm">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Select
                        options={[
                          { value: 'new', label: 'New' },
                          { value: 'contacted', label: 'Contacted' },
                          { value: 'qualified', label: 'Qualified' },
                          { value: 'closed', label: 'Closed' },
                        ]}
                        value={inquiry.status}
                        onChange={(value) => handleStatusUpdate(inquiry._id, value)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredInquiries.length === 0 && (
        <Card className="text-center py-12 mt-6">
          <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No inquiries found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </Card>
      )}
    </div>
  );
};