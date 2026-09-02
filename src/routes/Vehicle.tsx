import { useParams } from "react-router"

export function Vehicle() {
  const { vin } = useParams<{ vin: string }>()
  return <h1 className="text-lg font-medium">Vehicle {vin}</h1>
}
