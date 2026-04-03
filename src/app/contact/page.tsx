import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react'
import { config } from '@/lib/config'
import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: config.contact.whatsapp,
      link: config.contact.whatsappLink,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: 'Email',
      description: 'Send us an email',
      value: 'support@itechlk.store',
      link: 'mailto:support@itechlk.store',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Location',
      description: 'Visit us at',
      value: 'Morawaka, Sri Lanka',
      link: null,
      gradient: 'from-purple-500 to-pink-500'
    },
  ]

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-32 border-b border-neutral-200">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]" />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 border border-primary-200 mb-6">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">We&apos;re Here to Help</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Contact <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card key={index} className="group border-2 border-neutral-200 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500" />
                  
                  <CardContent className="p-8 text-center relative">
                    <div className={`inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br ${method.gradient} mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <div className="text-white">
                        {method.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">{method.title}</h3>
                    <p className="text-sm text-neutral-600 mb-4 group-hover:text-neutral-700 transition-colors">{method.description}</p>
                    {method.link ? (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-neutral-900 font-semibold">{method.value}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
              {/* Contact Form */}
              <Card className="border-2 border-neutral-200 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">Send a Message</h2>
                  </div>
                  <ContactForm />
                </CardContent>
              </Card>

              {/* Business Hours & Info */}
              <div className="space-y-8">
                {/* Business Hours */}
                <Card className="border-2 border-neutral-200 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-neutral-900">Business Hours</h2>
                    </div>
                    <div className="space-y-4">
                      {businessHours.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b border-neutral-200 last:border-0">
                          <span className="text-neutral-700 font-medium">{item.day}</span>
                          <span className="text-neutral-900 font-semibold">{item.hours}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-success-50 border-2 border-success-200 rounded-xl">
                      <p className="text-sm text-success-900 font-medium">
                        💬 WhatsApp support available 24/7 for urgent inquiries!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Response */}
                <Card className="border-2 border-neutral-200 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900">Quick Response</h3>
                    </div>
                    <p className="text-neutral-700 mb-6 leading-relaxed">
                      For the fastest response, contact us via WhatsApp. We typically respond within 5-15 minutes during business hours.
                    </p>
                    <a
                      href={config.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="lg" className="w-full">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Support Info */}
                <Card className="border-2 border-neutral-200 shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-neutral-900 mb-4">Need Help?</h3>
                    <div className="space-y-3 text-sm text-neutral-700">
                      <p>✓ Order tracking and status updates</p>
                      <p>✓ Account delivery issues</p>
                      <p>✓ Payment verification</p>
                      <p>✓ Technical support</p>
                      <p>✓ Refund requests</p>
                      <p>✓ General inquiries</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map (Full Width) */}
            <div className="max-w-6xl mx-auto">
              <Card className="border-2 border-neutral-200 shadow-xl overflow-hidden">
                <CardContent className="p-8 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900">Our Location</h2>
                  </div>
                  <div className="w-full h-[400px] rounded-xl overflow-hidden mb-8">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3967.3456789!2d80.42469460000001!3d6.317809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTknMDQuMSJOIDgwwrAyNSczNy4wIkU!5e0!3m2!1sen!2slk!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Looking for Answers?
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Check out our FAQ section for quick answers to common questions
            </p>
            <a href="/how-it-works#faq">
              <Button variant="outline" size="lg">
                View FAQs
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
