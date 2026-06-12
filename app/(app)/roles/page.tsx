import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"

export default function RolesPage() {
  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Configure role-based access control and permission policies."
      />
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[320px] items-center justify-center p-8 text-[#64748b]">
          Roles & permissions module — coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
