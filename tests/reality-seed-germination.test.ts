import { describe, it, beforeEach, expect } from "vitest"

describe("Reality Seed Germination Contract", () => {
  let mockStorage: Map<string, any>
  let nextSeedId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextSeedId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "plant-reality-seed":
        nextSeedId++
        mockStorage.set(`seed-${nextSeedId}`, {
          germination_stage: 0,
          stability: 100,
        })
        return { success: true, value: nextSeedId }
      case "nurture-seed":
        const [seedId] = args
        const seed = mockStorage.get(`seed-${seedId}`)
        if (!seed) return { success: false, error: 404 }
        if (seed.germination_stage >= 100) return { success: false, error: 403 }
        seed.germination_stage += 1
        seed.stability -= 1
        return { success: true }
      case "get-reality-seed":
        return { success: true, value: mockStorage.get(`seed-${args[0]}`) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should plant a new reality seed", () => {
    const result = mockContractCall("plant-reality-seed")
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
  })
  
  it("should nurture a seed", () => {
    mockContractCall("plant-reality-seed")
    const result = mockContractCall("nurture-seed", [1])
    expect(result.success).toBe(true)
  })
  
  it("should fail to nurture a fully grown seed", () => {
    mockContractCall("plant-reality-seed")
    for (let i = 0; i < 100; i++) {
      mockContractCall("nurture-seed", [1])
    }
    const result = mockContractCall("nurture-seed", [1])
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get reality seed information", () => {
    mockContractCall("plant-reality-seed")
    mockContractCall("nurture-seed", [1])
    const result = mockContractCall("get-reality-seed", [1])
    expect(result.success).toBe(true)
    expect(result.value).toEqual({
      germination_stage: 1,
      stability: 99,
    })
  })
})

