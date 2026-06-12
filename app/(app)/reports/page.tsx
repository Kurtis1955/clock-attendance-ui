import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate attendance, device, and compliance reports."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          Reports module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
