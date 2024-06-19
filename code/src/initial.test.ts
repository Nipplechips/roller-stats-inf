import { describe, test, expect } from "@jest/globals"

describe('Test that testing framework works', () =>{
    test('Returns correct value', () =>{
        expect(2+3).toEqual(5)
    })
})