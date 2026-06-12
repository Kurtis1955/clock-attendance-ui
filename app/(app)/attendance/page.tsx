import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function AttendancePage() {
  return (
    <div>
      <PageHeader
        title="Attendance"
        description="View real-time attendance records and clocking events."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          Attendance monitoring module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
