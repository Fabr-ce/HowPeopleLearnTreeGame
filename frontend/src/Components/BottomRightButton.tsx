import { useSocket } from "../App"

export default function BottomRightButton({
	adminId,
	event,
	title,
}: {
	adminId?: string | null
	event: string
	title: string
}) {
	const socket = useSocket()

	const isAdmin = adminId === socket.id

	const emitEvent = () => {
		socket.emit(event)
	}

	return isAdmin ? (
		<button className="btn btn-primary min-w-sm absolute bottom-4 right-4" onClick={emitEvent}>
			{title}
		</button>
	) : null
}
