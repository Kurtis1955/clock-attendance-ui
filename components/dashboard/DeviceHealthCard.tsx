import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deviceHealth } from "@/lib/dashboard-data"
import { TrendingUp } from "lucide-react"

const RADIUS = 72
const STROKE = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DeviceHealthCard({onLineDevice,offLineDevice} : any) {
  console.log("cardData>>",onLineDevice)
  const total =  onLineDevice + offLineDevice
  const segments = [
    // { value: deviceHealth.healthy, color: "#22c55e", label: "Healthy" },
    { value: onLineDevice || 0, color: "#22c55e", label: "Online" },
    { value: offLineDevice || 0, color: "#ef4444", label: "Offline" },
  ]

  let offset = 0

  return (
    <Card className="border-slate-200 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-[#0f172a]">
          Device Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex px-10 lg:flex-col gap-10 items-center h-full">
        <div className="w-2/3 lg:w-full relative flex items-center justify-center">
          <svg
            width="300"
            height="200"
            viewBox="0 0 200 200"
            role="img"
            aria-label={`${deviceHealth.online} devices online out of ${total}`}
          >
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              className="stroke-slate-100"
              strokeWidth={STROKE}
            />
            {segments.map((segment) => {
              const length = (segment.value / total) * CIRCUMFERENCE
              const dashArray = `${length} ${CIRCUMFERENCE - length}`
              const dashOffset = -offset
              offset += length

              return (
                <circle
                  key={segment.label}
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 100 100)"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-4xl font-bold text-[#0f172a]">
              {onLineDevice}
            </p>
            <p className="text-sm font-medium text-[#64748b]">Online</p>
          </div>
        </div>

        <div className=" w-1/3 lg:w-full ">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="flex items-center justify-start gap-6 lg:justify-between text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                  aria-hidden="true"
                />
                <span className="text-[#64748b]">{segment.label}</span>
              </div>
              <span className="font-semibold text-[#0f172a]">
                {segment.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Total devices online: {deviceHealth.healthy} <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total devices for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
