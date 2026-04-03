'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Mail, 
  Phone,
  Gift,
  Shield,
  Loader2,
  ArrowLeft,
  Save,
  Edit,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    loyaltyPoints: 0,
    referralCode: '',
    isAdmin: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/profile')
    } else if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          whatsappNumber: userData.whatsappNumber,
        }),
      })

      if (res.ok) {
        toast.success('Profile updated successfully!')
        setEditing(false)
        // Update session
        await update()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData.referralCode)
    toast.success('Referral code copied!')
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-neutral-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1 py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-10">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Profile</h1>
            <p className="text-lg text-neutral-600">Manage your account information</p>
          </div>

          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditing(false)
                        fetchUserData()
                      }}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
                  {session?.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'User'}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{userData.name}</h3>
                    <p className="text-neutral-600">{userData.email}</p>
                    {userData.isAdmin && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      disabled={!editing}
                      icon={<User className="h-5 w-5" />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      value={userData.email}
                      disabled
                      icon={<Mail className="h-5 w-5" />}
                    />
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      WhatsApp Number
                    </label>
                    <Input
                      value={userData.whatsappNumber || ''}
                      onChange={(e) => setUserData({ ...userData, whatsappNumber: e.target.value })}
                      disabled={!editing}
                      placeholder="+94 XX XXX XXXX"
                      icon={<Phone className="h-5 w-5" />}
                    />
                    <p className="text-xs text-neutral-500 mt-1">We&apos;ll send your account details to this number</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Points Card */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary-600" />
                  Loyalty Points
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Your Points</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                      {userData.loyaltyPoints}
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  Earn points with every purchase and redeem them for discounts on future orders!
                </p>
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card className="border-2 border-neutral-200 shadow-lg">
              <CardHeader className="border-b border-neutral-100 bg-gradient-to-r from-success-50 to-primary-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success-600" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <p className="text-neutral-600 mb-4">
                  Share your referral code with friends and earn rewards when they make their first purchase!
                </p>
                <div className="flex gap-3">
                  <Input
                    value={userData.referralCode}
                    readOnly
                    className="font-mono font-bold text-lg"
                  />
                  <Button 
                    variant="primary" 
                    onClick={copyReferralCode}
                    className="min-w-[140px] whitespace-nowrap"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-success-50 border-2 border-success-200 rounded-xl">
                  <p className="text-sm text-success-900">
                    <strong>Earn LKR 100</strong> for each friend who makes a purchase using your code!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
