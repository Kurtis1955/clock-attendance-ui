import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="ERP Integration"
        description="Connect and sync attendance data with enterprise resource planning systems."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          ERP integration module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
