'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function ApproveButton({ educatorId }: { educatorId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleApprove() {
    setLoading(true)
    const res = await fetch('/api/admin/approve-educator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ educatorId }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Failed to approve')
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleApprove}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Approve'}
    </Button>
  )
}
