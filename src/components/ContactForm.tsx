"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast.success('Your message has been sent successfully!')
        reset()
      } else {
        toast.error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Name</label>
          <Input 
            {...register('name')} 
            placeholder="John Doe"
            className="bg-white border-neutral-300"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Email</label>
          <Input 
            {...register('email')} 
            type="email" 
            placeholder="john@example.com"
            className="bg-white border-neutral-300"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">Subject</label>
        <Input 
          {...register('subject')} 
          placeholder="How can we help you?"
          className="bg-white border-neutral-300"
        />
        {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Write your message here..."
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
