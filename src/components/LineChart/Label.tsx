import React from "react"

type Props = {
  color: string
  label: string
  size?: number
  onClick?: (e?: string) => void
  className?: string
}
function Label(props: Props) {
  const { color, size = 10, label } = props
  return (
    <div
      className={props.className}
      onClick={() => props.onClick && props.onClick(label)}
    >
      <div
        style={{
          borderRadius: "50%",
          background: color,
          width: `${size}px`,
          height: `${size}px`,
          marginRight: "10px",
        }}
      />
      <p>{label}</p>
    </div>
  )
}

export default Label
