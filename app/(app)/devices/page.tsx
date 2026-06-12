import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function DevicesPage() {
  return (
    <div>
      <PageHeader
        title="Devices"
        description="Monitor and manage ZKTeco and third-party biometric devices."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          Device management module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
