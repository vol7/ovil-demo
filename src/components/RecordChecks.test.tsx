import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { evaluateChecks } from "@/lib/checks"
import { CLEAN_VIN, CLONED_VIN, findVehicle } from "@/lib/vehicles"
import { RecordChecks } from "./RecordChecks"

describe("RecordChecks", () => {
  it("renders six checks with pass status for the clean vehicle", () => {
    render(<RecordChecks checks={evaluateChecks(findVehicle(CLEAN_VIN)!)} />)
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(6)
    expect(screen.getAllByText("Pass")).toHaveLength(6)
    expect(screen.getByText(/6 of 6 checks passed/i)).toBeInTheDocument()
  })

  it("marks failures and shows their detail", () => {
    render(<RecordChecks checks={evaluateChecks(findVehicle(CLONED_VIN)!)} />)
    expect(screen.getAllByText("Fail")).toHaveLength(3)
    expect(screen.getByText(/Aviva Canada/)).toBeInTheDocument()
    expect(screen.getByText(/3 of 6 checks failed/i)).toBeInTheDocument()
  })
})
