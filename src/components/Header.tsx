'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="p-4 flex justify-between items-center border-b">
      <div className="flex items-center">
        <Image
          src="/polit-logo.png"
          alt="Polit Logo"
          width={65}
          height={65}
          className="ml-10"
        />
        
      </div>
      <div className="flex gap-4">
        <button className="text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          New chat
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-100 p-2 rounded-lg mr-10"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg">
              <Link href="/upload-pdf" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Upload PDF
              </Link>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Settings
              </a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Help
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function PlusIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  )
}

function SettingsIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
} 