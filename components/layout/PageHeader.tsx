import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="w-full mb-6 flex flex-col gap-4 sm:mb-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="w-full flex flex-col gap-1 sm:w-1/2">
        <h1 className="w-full text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#64748b] sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="w-full flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
