import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function EnrollmentPage() {
  return (
    <div>
      <PageHeader
        title="Biometric Enrollment"
        description="Enroll users and synchronize biometric templates to devices."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          Biometric enrollment module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
