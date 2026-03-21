'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../utils/supabase'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalProviders: 0,
    approvedProviders: 0,
    pendingProviders: 0,
    totalCustomers: 0,
    totalMessages: 0,
    providersByCategory: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: totalProviders },
        { count: approvedProviders },
        { count: pendingProviders },
        { count: totalMessages },
        { data: byCategory }
      ] = await Promise.all([
        supabase.from('providers').select('*', { count: 'exact', head: true }),
        supabase.from('providers').select('*', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('providers').select('*', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('providers').select('categories(name, icon)').eq('is_approved', true)
      ])

      const categoryCount = {}
      byCategory?.forEach(p => {
        const name = p.categories?.name || 'Unknown'
        const icon = p.categories?.icon || ''
        categoryCount[name] = categoryCount[name] || { count: 0, icon }
        categoryCount[name].count++
      })

      const providersByCategory = Object.entries(categoryCount).map(([name, val]) => ({
        name,
        icon: val.icon,
        count: val.count
      })).sort((a, b) => b.count - a.count)

      setStats({
        totalProviders: totalProviders || 0,
        approvedProviders: approvedProviders || 0,
        pendingProviders: pendingProviders || 0,
        totalMessages: totalMessages || 0,
        providersByCategory
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-600">Loading analytics...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-700">Analytics Dashboard</h1>
          <a href="/admin" className="text-sm text-red-600 hover:underline">Back to Admin</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-red-600">{stats.totalProviders}</p>
            <p className="text-sm text-gray-500 mt-1">Total Providers</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.approvedProviders}</p>
            <p className="text-sm text-gray-500 mt-1">Approved</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingProviders}</p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalMessages}</p>
            <p className="text-sm text-gray-500 mt-1">Total Messages</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Providers by Category</h2>
          {stats.providersByCategory.length === 0 ? (
            <p className="text-gray-400 text-sm">No approved providers yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.providersByCategory.map(cat => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: (cat.count / stats.approvedProviders * 100) + '%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <a
            href="/admin"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            Manage Providers
          </a>
        </div>
      </div>
    </div>
  )
}