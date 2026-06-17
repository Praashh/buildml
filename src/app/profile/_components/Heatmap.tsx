"use client";

import { useMemo } from "react";
import { cn } from "~/lib/utils";

interface HeatmapProps {
	data: Record<string, number>;
}

export function Heatmap({ data }: HeatmapProps) {
	const weeks = useMemo(() => {
		const result = [];
		const today = new Date();
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(today.getFullYear() - 1);

		// Current week starts on Sunday
		const start = new Date(oneYearAgo);
		start.setDate(start.getDate() - start.getDay());

		const currentDay = new Date(start);
		while (currentDay <= today || result.length < 53) {
			const week = [];
			for (let i = 0; i < 7; i++) {
				const dateStr = currentDay.toISOString().split("T")[0];
				week.push({
					date: new Date(currentDay),
					count: data[dateStr!] ?? 0,
					dateStr,
				});
				currentDay.setDate(currentDay.getDate() + 1);
			}
			result.push(week);
			if (currentDay > today && result.length >= 52) break;
		}
		return result;
	}, [data]);

	const getColor = (count: number) => {
		if (count === 0) return "bg-[var(--line)]";
		if (count < 2) return "bg-primary/30";
		if (count < 5) return "bg-primary/60";
		return "bg-primary";
	};

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	return (
		<div className="scrollbar-hide flex flex-col gap-2 overflow-x-auto pb-4">
			<div className="flex gap-0.75">
				{weeks.map((week, weekIndex) => (
					<div
						className="flex flex-col gap-0.75"
						// biome-ignore lint/suspicious/noArrayIndexKey: weeks list is static and order-stable
						key={weekIndex}
					>
						{week.map((day, _dayIndex) => (
							<div
								className={cn(
									"h-2.5 w-2.5 rounded-[2px] transition-colors duration-200",
									getColor(day.count),
								)}
								key={day.dateStr}
								title={`${day.count} submissions on ${day.date.toDateString()}`}
							/>
						))}
					</div>
				))}
			</div>

			<div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
				{months.map((month) => (
					<span key={month}>{month}</span>
				))}
			</div>
		</div>
	);
}
