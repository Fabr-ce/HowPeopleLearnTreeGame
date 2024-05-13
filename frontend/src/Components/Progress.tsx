import { useEffect, useState } from "react"

const stepsInMs = 20
const totalTimeInSec = 30 - 1 // -1 for some delays

export default function Progress() {
	const [progress, changeProgress] = useState(100)

	useEffect(() => {
		const a = setInterval(() => {
			if (progress <= 0) {
				clearInterval(a)
				return
			}
			changeProgress(progress => Math.max(progress - (stepsInMs / 1000) * (100 / totalTimeInSec), 0))
		}, stepsInMs)

		return () => {
			clearInterval(a)
		}
	})

	return <progress className="progress progress-secondary h-4 max-w-sm" value={progress} max="100"></progress>
}
