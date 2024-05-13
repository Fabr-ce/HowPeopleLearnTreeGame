import classNames from "classnames"
import { useSocket } from "../App"
import { useEffect, useState } from "react"

export default function BottomRightButton({
	adminId,
	event,
	title,
	wait = false,
}: {
	adminId?: string | null
	event: string
	title: string
	wait?: boolean
}) {
	const socket = useSocket()

	const [pressable, changePressable] = useState(false)
	useEffect(() => {
		setTimeout(() => {
			changePressable(true)
		}, 2000)
	})

	const isAdmin = adminId === socket.id

	const emitEvent = () => {
		if (wait && !pressable) return
		socket.emit(event)
	}

	return isAdmin ? (
		<button
			className={classNames("btn btn-primary min-w-sm fixed bottom-4 right-4", {
				"btn-disabled": wait && !pressable,
			})}
			onClick={emitEvent}
		>
			{title}
		</button>
	) : null
}
