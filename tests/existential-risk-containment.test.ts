import { describe, it, beforeEach, expect } from "vitest"

describe("Existential Risk Containment Contract", () => {
  let mockStorage: Map<string, any>
  let nextEventId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextEventId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "register-risk-event":
        const [riskType, severity] = args
        nextEventId++
        mockStorage.set(`event-${nextEventId}`, {
          risk_type: riskType,
          severity,
          containment_status: "uncontained",
        })
        return { success: true, value: nextEventId }
      case "update-containment-status":
        const [eventId, newStatus] = args
        const event = mockStorage.get(`event-${eventId}`)
        if (!event) return { success: false, error: 404 }
        event.containment_status = newStatus
        return { success: true }
      case "get-risk-event":
        return { success: true, value: mockStorage.get(`event-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a new risk event", () => {
    const result = mockContractCall("register-risk-event", ["reality-collapse", 80])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should update containment status", () => {
    mockContractCall("register-risk-event", ["reality-collapse", 80])
    const result = mockContractCall("update-containment-status", [1, "contained"])
    expect(result.success).toBe(true)
  })
  
  it("should get risk event information", () => {
    mockContractCall("register-risk-event", ["reality-collapse", 80])
    const result = mockContractCall("get-risk-event", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      risk_type: "reality-collapse",
      severity: 80,
      containment_status: "uncontained",
    })
  })
})

