'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Car,
  Download,
  User,
  Home,
  Shield,
  Users
} from 'lucide-react'

export default function OwnerDashboard() {
  const [language, setLanguage] = useState<'ar' | 'en'>('en')

  const isArabic = language === 'ar'

  const stats = {
    totalSpaces: 0,
    occupiedSpaces: 0,
    occupancyRate: 0,
    todayRevenue: 0,
  }

  const garages: any[] = [] // Empty for now

  const translations = {
    ar: {
      title: 'لوحة تحكم صاحب الموقف',
      totalSpaces: 'إجمالي الأماكن',
      occupied: 'مشغول',
      occupancyRate: 'معدل الإشغال',
      todayRevenue: 'إيرادات اليوم',
      myParkings: 'مواقفي',
      parkingName: 'اسم الموقف',
      location: 'الموقع',
      spaces: 'الأماكن',
      price: 'السعر',
      status: 'الحالة',
      actions: 'الإجراءات',
      addParking: 'إضافة موقف',
      exportData: 'تصدير البيانات',
      occupancyTrend: 'اتجاه الإشغال',
      monthlyRevenue: 'الإيرادات الشهرية',
      profile: 'الملف الشخصي',
      forAdmin: 'للإدارة',
      forDrivers: 'للسائقين',
      home: 'الرئيسية',
    },
    en: {
      title: 'Parking Owner Dashboard',
      totalSpaces: 'Total Spaces',
      occupied: 'Occupied',
      occupancyRate: 'Occupancy Rate',
      todayRevenue: "Today's Revenue",
      myParkings: 'My Parkings',
      parkingName: 'Parking Name',
      location: 'Location',
      spaces: 'Spaces',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
      addParking: 'Add Parking',
      exportData: 'Export Data',
      occupancyTrend: 'Occupancy Trend',
      monthlyRevenue: 'Monthly Revenue',
      profile: 'Profile',
      forAdmin: 'For Admin',
      forDrivers: 'For Drivers',
      home: 'Home',
    },
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Custom Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-600">Rakna</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                <User className="h-5 w-5" />
                <span>{t.profile}</span>
              </button>
              <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                {t.forAdmin}
              </button>
              <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                {t.forDrivers}
              </button>
              <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                {t.home}
              </button>
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="h-5 w-5" />
                <span>{t.addParking}</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="h-5 w-5" />
                <span>{t.exportData}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Stats Grid - Matching the image design exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Spaces - Purple */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                +5%
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalSpaces}</p>
            <p className="text-sm text-gray-600 font-medium">{t.totalSpaces}</p>
          </div>

          {/* Occupied Spaces - Blue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                -2%
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.occupiedSpaces}</p>
            <p className="text-sm text-gray-600 font-medium">{t.occupied}</p>
          </div>

          {/* Occupancy Rate - Blue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                +3%
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.occupancyRate}%</p>
            <p className="text-sm text-gray-600 font-medium">{t.occupancyRate}</p>
          </div>

          {/* Today's Revenue - Blue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                +12%
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {isArabic ? `${stats.todayRevenue} جنيه` : `${stats.todayRevenue} EGP`}
            </p>
            <p className="text-sm text-gray-600 font-medium">{t.todayRevenue}</p>
          </div>
        </div>

        {/* Parking List Section - Matching image exactly */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t.myParkings}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.parkingName}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.location}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.spaces}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.occupied}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.price}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.status}</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-gray-800">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {garages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      {isArabic ? 'لا توجد مواقف متاحة' : 'No parkings available'}
                    </td>
                  </tr>
                ) : (
                  garages.map((garage) => (
                    <tr key={garage.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{garage.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{garage.location}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{garage.totalSpaces}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{garage.occupied}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-medium">{garage.rate} {isArabic ? 'جنيه/ساعة' : 'EGP/hr'}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {isArabic ? 'نشط' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title={isArabic ? 'تعديل' : 'Edit'}>
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={isArabic ? 'حذف' : 'Delete'}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section - Occupancy Trend and Monthly Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Occupancy Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t.occupancyTrend}</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">
                {isArabic ? 'رسم بياني سيتم إضافته' : 'Chart will be added here'}
              </p>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t.monthlyRevenue}</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">
                {isArabic ? 'رسم بياني سيتم إضافته' : 'Chart will be added here'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
