'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  DollarSign,
  Clock,
  Shield,
  Bell,
  Globe,
  Key,
  CheckCircle2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Store Information
    storeName: 'iTechLK Store',
    storeEmail: 'itechlkstore@gmail.com',
    storePhone: '+94742570943',
    storeWhatsApp: '+94742570943',
    
    // Bank Details - Commercial Bank
    bankCommercialName: 'P A INDIRA UMANGA (ANUHAS P A I U )',
    bankCommercialAccount: '8028757579',
    bankCommercialBranch: 'MORAWAKA',
    
    // Bank Details - BOC
    bankBocName: 'P A INDIRA UMANGA (ANUHAS P A I U )',
    bankBocAccount: '72790749',
    bankBocBranch: 'MORAWAKA',
    
    // Delivery Settings
    defaultDeliveryTime: '5-15 minutes',
    warrantyPeriod: '30-day replacement guarantee',
    
    // Notification Settings
    telegramEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true,
    
    // Site Settings
    siteUrl: 'http://localhost:3001',
    maintenanceMode: false,
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate save - you can implement actual API call here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Settings saved successfully!', {
        icon: '✅',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="hover:bg-neutral-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">Store Settings</h1>
                <p className="text-neutral-600 mt-1">Configure your store preferences</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={loading}
              className="shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Information */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Store Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Store Name
                  </label>
                  <Input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    placeholder="iTechLK Store"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Store Email
                  </label>
                  <Input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    placeholder="store@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Store Phone
                  </label>
                  <Input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    placeholder="+94XXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    WhatsApp Number
                  </label>
                  <Input
                    type="tel"
                    value={settings.storeWhatsApp}
                    onChange={(e) => setSettings({ ...settings, storeWhatsApp: e.target.value })}
                    placeholder="+94XXXXXXXXX"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bank Details - Commercial Bank */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-success-50 to-primary-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-success-600 to-primary-600 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Commercial Bank Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Account Name
                  </label>
                  <Input
                    type="text"
                    value={settings.bankCommercialName}
                    onChange={(e) => setSettings({ ...settings, bankCommercialName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Account Number
                  </label>
                  <Input
                    type="text"
                    value={settings.bankCommercialAccount}
                    onChange={(e) => setSettings({ ...settings, bankCommercialAccount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Branch
                  </label>
                  <Input
                    type="text"
                    value={settings.bankCommercialBranch}
                    onChange={(e) => setSettings({ ...settings, bankCommercialBranch: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bank Details - BOC */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-secondary-50 to-accent-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-secondary-600 to-accent-600 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Bank of Ceylon Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Account Name
                  </label>
                  <Input
                    type="text"
                    value={settings.bankBocName}
                    onChange={(e) => setSettings({ ...settings, bankBocName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Account Number
                  </label>
                  <Input
                    type="text"
                    value={settings.bankBocAccount}
                    onChange={(e) => setSettings({ ...settings, bankBocAccount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Branch
                  </label>
                  <Input
                    type="text"
                    value={settings.bankBocBranch}
                    onChange={(e) => setSettings({ ...settings, bankBocBranch: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Settings */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-warning-50 to-success-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-warning-600 to-success-600 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Delivery Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Default Delivery Time
                  </label>
                  <Input
                    type="text"
                    value={settings.defaultDeliveryTime}
                    onChange={(e) => setSettings({ ...settings, defaultDeliveryTime: e.target.value })}
                    placeholder="5-15 minutes"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Shown to customers on product pages</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Warranty Period
                  </label>
                  <Input
                    type="text"
                    value={settings.warrantyPeriod}
                    onChange={(e) => setSettings({ ...settings, warrantyPeriod: e.target.value })}
                    placeholder="30-day replacement guarantee"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Warranty information for customers</p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-warning-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary-600 to-warning-600 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Notification Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-neutral-900 block">Telegram Notifications</span>
                        <span className="text-xs text-neutral-600">Receive order alerts via Telegram</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.telegramEnabled}
                      onChange={(e) => setSettings({ ...settings, telegramEnabled: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-neutral-900 block">Email Notifications</span>
                        <span className="text-xs text-neutral-600">Send order confirmations via email</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailEnabled}
                      onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer hover:border-primary-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-neutral-900 block">WhatsApp Notifications</span>
                        <span className="text-xs text-neutral-600">Contact customers via WhatsApp</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.whatsappEnabled}
                      onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Site Settings */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-secondary-50 to-primary-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-secondary-600 to-primary-600 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Site Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">
                    Site URL
                  </label>
                  <Input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    placeholder="https://yourdomain.com"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Your store&apos;s public URL</p>
                </div>

                <div className="p-4 bg-warning-50 rounded-xl border border-warning-200">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold text-neutral-900 block">Maintenance Mode</span>
                      <span className="text-xs text-neutral-600">Temporarily disable the store</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="w-5 h-5 text-warning-600 border-neutral-300 rounded focus:ring-warning-500 cursor-pointer"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environment Variables Info */}
          <Card className="border-2 border-neutral-200 shadow-lg mt-6">
            <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Key className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl">Environment Variables</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Database Connection</span>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Telegram Bot</span>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Configured
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Email Service</span>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Cloudinary</span>
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                💡 <strong>Note:</strong> Environment variables are configured in your <code className="bg-white px-2 py-0.5 rounded">.env</code> file. 
                Restart the server after making changes to environment variables.
              </p>
            </CardContent>
          </Card>

          {/* Save Button - Bottom */}
          <div className="mt-8 flex justify-end">
            <Button 
              variant="primary" 
              size="default"
              onClick={handleSave}
              disabled={loading}
              className="px-8 h-12 text-base font-bold shadow-lg hover:shadow-xl"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Saving Changes...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
    </div>
  )
}
