'use client'

import { useState } from 'react'
import { Copy, Check, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { config } from '@/lib/config'

interface BankDetail {
  bank: string
  accountNumber: string
  branch: string
  accountName: string
  gradient: string
}

interface CopyBankDetailsProps {
  className?: string
}

export default function CopyBankDetails({ className }: CopyBankDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const bankDetails: BankDetail[] = [
    {
      bank: config.bank.commercial.name,
      accountNumber: config.bank.commercial.accountNumber,
      branch: config.bank.commercial.branch,
      accountName: config.bank.commercial.accountName,
      gradient: 'from-primary-600 to-primary-700'
    },
    {
      bank: config.bank.boc.name,
      accountNumber: config.bank.boc.accountNumber,
      branch: config.bank.boc.branch,
      accountName: config.bank.boc.accountName,
      gradient: 'from-secondary-600 to-secondary-700'
    }
  ]

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success(`${fieldName} copied!`, {
        icon: '✓',
        duration: 2000,
        position: 'bottom-center',
      })
      
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedField(null)
      }, 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const CopyButton = ({ 
    text, 
    fieldName, 
    label 
  }: { 
    text: string
    fieldName: string
    label?: string 
  }) => {
    const isCopied = copiedField === fieldName
    
    return (
      <button
        onClick={() => copyToClipboard(text, label || fieldName)}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
          isCopied
            ? "bg-success-100 text-success-700 border-2 border-success-300"
            : "bg-white/20 text-white hover:bg-white/30 border-2 border-white/30 hover:border-white/50"
        )}
      >
        {isCopied ? (
          <>
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Copy</span>
          </>
        )}
      </button>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {bankDetails.map((bank, index) => (
        <div
          key={index}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
            bank.gradient
          )}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative">
            {/* Bank name */}
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5" />
              <h3 className="font-semibold text-lg">{bank.bank}</h3>
            </div>

            {/* Account Number - Main focus */}
            <div className="mb-4">
              <div className="text-xs text-white/70 mb-2">Account Number</div>
              <div className="flex items-center justify-between gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-2xl sm:text-3xl font-bold tracking-wider">
                  {bank.accountNumber}
                </div>
                <CopyButton 
                  text={bank.accountNumber} 
                  fieldName={`${bank.bank}-account`}
                  label="Account Number"
                />
              </div>
            </div>

            {/* Other details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Branch */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xs text-white/70 mb-1">Branch</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold">{bank.branch}</div>
                  <CopyButton 
                    text={bank.branch} 
                    fieldName={`${bank.bank}-branch`}
                    label="Branch"
                  />
                </div>
              </div>

              {/* Account Name */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-xs text-white/70 mb-1">Account Name</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm">{bank.accountName}</div>
                  <CopyButton 
                    text={bank.accountName} 
                    fieldName={`${bank.bank}-name`}
                    label="Account Name"
                  />
                </div>
              </div>
            </div>

            {/* Quick copy all button */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  const allDetails = `Bank: ${bank.bank}\nAccount: ${bank.accountNumber}\nBranch: ${bank.branch}\nName: ${bank.accountName}`
                  copyToClipboard(allDetails, `${bank.bank}-all`)
                }}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 border-2 border-white/30 hover:border-white/50 flex items-center justify-center gap-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy All Details</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Helper text */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Copy className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-900 mb-1">Quick Copy Tips</h4>
            <ul className="text-sm text-neutral-700 space-y-1">
              <li>• Click any &quot;Copy&quot; button to copy that specific detail</li>
              <li>• Use &quot;Copy All Details&quot; to copy everything at once</li>
              <li>• Paste directly into your banking app</li>
              <li>• Double-check the amount before transferring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for other pages
export function CopyBankDetailsCompact({ className }: { className?: string }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast.success('Copied!', { duration: 1500 })
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div>
          <div className="text-xs text-neutral-600">{config.bank.commercial.name}</div>
          <div className="font-mono font-bold text-neutral-900">{config.bank.commercial.accountNumber}</div>
        </div>
        <button
          onClick={() => copyToClipboard(config.bank.commercial.accountNumber, 'commercial')}
          className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          {copiedField === 'commercial' ? (
            <Check className="h-4 w-4 text-success-600" />
          ) : (
            <Copy className="h-4 w-4 text-neutral-600" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div>
          <div className="text-xs text-neutral-600">{config.bank.boc.name}</div>
          <div className="font-mono font-bold text-neutral-900">{config.bank.boc.accountNumber}</div>
        </div>
        <button
          onClick={() => copyToClipboard(config.bank.boc.accountNumber, 'boc')}
          className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          {copiedField === 'boc' ? (
            <Check className="h-4 w-4 text-success-600" />
          ) : (
            <Copy className="h-4 w-4 text-neutral-600" />
          )}
        </button>
      </div>
    </div>
  )
}
