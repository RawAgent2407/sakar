import { Property } from '../types';

export const mockInquiries = [
  {
    id: '1',
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    interestedIn: '3 BHK',
    propertyId: '1',
    propertyName: 'Skyline Residences',
    message: 'Looking for a 3 BHK apartment with good amenities',
    status: 'new' as const,
    source: 'website' as const,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543211',
    interestedIn: '2 BHK',
    propertyId: '1',
    propertyName: 'Skyline Residences',
    status: 'contacted' as const,
    source: 'phone' as const,
    createdAt: '2024-01-19T14:15:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
  },
  {
    id: '3',
    fullName: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 9876543212',
    interestedIn: '4 BHK Villa',
    propertyId: '2',
    propertyName: 'Green Valley Villas',
    message: 'Interested in villa with private garden',
    status: 'qualified' as const,
    source: 'website' as const,
    createdAt: '2024-01-18T09:45:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
  },
  {
    id: '4',
    fullName: 'Sunita Gupta',
    email: 'sunita.gupta@email.com',
    phone: '+91 9876543213',
    interestedIn: '2 BHK',
    status: 'new' as const,
    source: 'walk-in' as const,
    createdAt: '2024-01-17T16:20:00Z',
    updatedAt: '2024-01-17T16:20:00Z',
  },
];

// Property mock data removed. Use MongoDB via the API now.
export const mockProperties = [];