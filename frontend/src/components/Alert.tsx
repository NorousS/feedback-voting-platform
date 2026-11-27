type AlertProps = { message: string }

export function Alert({ message }: AlertProps) {
  return <p className="alert" role="alert">{message}</p>
}
