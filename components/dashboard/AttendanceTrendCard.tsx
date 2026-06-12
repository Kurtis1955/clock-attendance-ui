"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  attendanceTrend30Days,
  attendanceTrend7Days,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

type Period = "7" | "30"

const CHART_WIDTH = 560
const CHART_HEIGHT = 200
const PADDING = { top: 16, right: 12, bottom: 28, left: 12 }

function buildChartPaths(values: number[]) {
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const max = Math.max(...values) * 1.1

  const points = values.map((value, index) => ({
    x:
      PADDING.left +
      (index / Math.max(values.length - 1, 1)) * innerWidth,
    y: PADDING.top + innerHeight - (value / max) * innerHeight,
    value,
  }))

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ")

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    PADDING.top + innerHeight
  } L ${points[0].x} ${PADDING.top + innerHeight} Z`

  return { points, linePath, areaPath, baseline: PADDING.top + innerHeight }
}

export function AttendanceTrendCard() {
  const [period, setPeriod] = React.useState<Period>("7")

  const dataset =
    period === "7" ? attendanceTrend7Days : attendanceTrend30Days
  const { points, linePath, areaPath, baseline } = buildChartPaths(
    dataset.values
  )

  const visibleLabels =
    period === "7"
      ? dataset.labels
      : dataset.labels.filter(
          (_, index) =>
            index === 0 ||
            index === dataset.labels.length - 1 ||
            (index + 1) % 5 === 0
        )

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold text-[#0f172a]">
          Attendance Trend
        </CardTitle>
        <div
          className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
          role="group"
          aria-label="Attendance trend period"
        >
          {(["7", "30"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(value)}
              className={cn(
                "h-7 rounded-md px-3 text-xs font-medium",
                period === value
                  ? "bg-white text-[#0f172a] shadow-sm"
                  : "text-[#64748b] hover:bg-transparent hover:text-[#0f172a]"
              )}
              aria-pressed={period === value}
            >
              {value} Days
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-[220px] w-full"
            role="img"
            aria-label={`Attendance trend chart for the last ${period} days`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = PADDING.top + (CHART_HEIGHT - PADDING.top - PADDING.bottom) * ratio
              return (
                <line
                  key={ratio}
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  className="stroke-slate-100"
                  strokeWidth={1}
                />
              )
            })}

            <path d={areaPath} className="fill-[#eab308]/15" />
            <path
              d={linePath}
              fill="none"
              className="stroke-[#eab308]"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={period === "7" ? 4 : 2.5}
                className="fill-[#eab308] stroke-white"
                strokeWidth={2}
              />
            ))}

            {period === "7"
              ? dataset.labels.map((label, index) => {
                  const x = points[index]?.x ?? 0
                  return (
                    <text
                      key={label}
                      x={x}
                      y={baseline + 20}
                      textAnchor="middle"
                      className="fill-[#64748b] text-[11px]"
                    >
                      {label}
                    </text>
                  )
                })
              : visibleLabels.map((label) => {
                  const index = dataset.labels.indexOf(label)
                  const x = points[index]?.x ?? 0
                  return (
                    <text
                      key={label}
                      x={x}
                      y={baseline + 20}
                      textAnchor="middle"
                      className="fill-[#64748b] text-[10px]"
                    >
                      {label}
                    </text>
                  )
                })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
