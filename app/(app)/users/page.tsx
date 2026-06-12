import { UserStatsCards } from "@/components/users/user-stats-cards"
import { UsersDataTable } from "@/components/users/users-data-table"
import { UsersPageHeader } from "@/components/users/users-page-header"

export default function UsersPage() {
  return (
    <div className="px-2 pt-2 lg:px-8">
      <UsersPageHeader />

      <UserStatsCards />

      <div className="mt-6">
        <UsersDataTable />
      </div>
    </div>
  )
}
