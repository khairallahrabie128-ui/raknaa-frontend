'use client'

import Navbar from '@/components/Navbar'
import { Search, MapPin, Clock, DollarSign, Car, Calendar } from 'lucide-react'

export default function UserDashboard() {
  const mockBookings = [
    {
      id: 1,
      garage: 'Downtown Parking',
      location: '123 Main St',
      startTime: '2024-01-15 10:00',
      duration: '2 hours',
      cost: 40,
      status: 'active',
    },
    {
      id: 2,
      garage: 'Mall Parking',
      location: '456 Oak Ave',
      startTime: '2024-01-14 14:30',
      duration: '3 hours',
      cost: 60,
      status: 'completed',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="user" userName="John Doe" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <p className="text-gray-600 mt-2">Find and manage your parking spots</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Parking</h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">100 EGP</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h2>
          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{booking.garage}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{booking.startTime}</span>
                      </div>
                      <div className="flex items-center">
                        <span>{booking.duration}</span>
                      </div>
                      <div className="flex items-center font-semibold text-primary-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{booking.cost} EGP</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

