import classNames from "classnames"

export default function ActivateButton({
	active,
	changeActive,
	title,
}: {
	active: boolean
	changeActive: (a: boolean) => void
	title: string
}) {
	return (
		<button
			className={classNames("btn", { "btn-active": active, "btn-secondary": !active })}
			onClick={() => changeActive(!active)}
		>
			{title}
		</button>
	)
}
