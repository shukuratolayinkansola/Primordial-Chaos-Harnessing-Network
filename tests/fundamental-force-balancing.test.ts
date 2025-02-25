import { describe, it, beforeEach, expect } from "vitest"

describe("Fundamental Force Balancing Contract", () => {
  let mockStorage: Map<string, any>
  let nextConfigId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextConfigId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "create-force-configuration":
        const [strong, weak, em, gravity] = args
        nextConfigId++
        mockStorage.set(`config-${nextConfigId}`, {
          strong_force: strong,
          weak_force: weak,
          electromagnetic_force: em,
          gravitational_force: gravity,
        })
        return { success: true, value: nextConfigId }
      case "adjust-forces":
        const [configId, newStrong, newWeak, newEm, newGravity] = args
        const config = mockStorage.get(`config-${configId}`)
        if (!config) return { success: false, error: 404 }
        config.strong_force = newStrong
        config.weak_force = newWeak
        config.electromagnetic_force = newEm
        config.gravitational_force = newGravity
        return { success: true }
      case "get-force-configuration":
        return { success: true, value: mockStorage.get(`config-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should create a new force configuration", () => {
    const result = mockContractCall("create-force-configuration", [25, 25, 25, 25])
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should adjust forces of an existing configuration", () => {
    mockContractCall("create-force-configuration", [25, 25, 25, 25])
    const result = mockContractCall("adjust-forces", [1, 30, 20, 30, 20])
    expect(result.success).toBe(true)
  })
  
  it("should get force configuration information", () => {
    mockContractCall("create-force-configuration", [25, 25, 25, 25])
    const result = mockContractCall("get-force-configuration", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      strong_force: 25,
      weak_force: 25,
      electromagnetic_force: 25,
      gravitational_force: 25,
    })
  })
})

