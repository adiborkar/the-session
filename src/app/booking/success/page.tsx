import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">You&apos;re booked!</h1>
        <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
          Your lesson is confirmed. You&apos;ll receive a confirmation email with the details shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/student">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              View my bookings
            </Button>
          </Link>
          <Link href="/educators">
            <Button variant="outline">Browse more educators</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
