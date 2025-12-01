'use client'

import Navbar from '@/components/Navbar'
import { Users, Building, Calendar, DollarSign, TrendingUp, Activity, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const stats = {
    totalUsers: 1250,
    totalGarages: 45,
    activeBookings: 89,
    totalRevenue: 125000,
    systemHealth: 98,
  }

  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registered', time: '5 minutes ago' },
    { id: 2, type: 'booking', action: 'New booking created', time: '12 minutes ago' },
    { id: 3, type: 'garage', action: 'New garage added', time: '1 hour ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" userName="Admin User" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">System-wide management and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">All users (drivers + owners)</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Garages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGarages}</p>
                <p className="text-xs text-gray-500 mt-1">From all owners</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} EGP</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Activity className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <span className="text-sm font-semibold text-green-600">{stats.systemHealth}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${stats.systemHealth}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">API Status</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sensors</span>
                  <span className="text-yellow-600 font-medium">Partial</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Building className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Manage Garages</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <TrendingUp className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">All Bookings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

