import { describe, it, expect } from "vitest";

import { compareValues } from "./compareValues";

describe("compareValues", () => {
  // "eq" comparison tests
  it("should return true for equal numbers using eq", () => {
    expect(compareValues(5, 5, "eq")).toBeTruthy();
  });

  it("should return false for unequal numbers using eq", () => {
    expect(compareValues(5, 10, "eq")).toBeFalsy();
  });

  it("should return true for equal strings using eq", () => {
    expect(compareValues("test", "test", "eq")).toBeTruthy();
  });

  it("should return false for unequal strings using eq", () => {
    expect(compareValues("test", "best", "eq")).toBeFalsy();
  });

  // "gt" (greater than) comparison tests
  it("should return true if first number is greater using gt", () => {
    expect(compareValues(10, 5, "gt")).toBeTruthy();
  });

  it("should return false if first number is not greater using gt", () => {
    expect(compareValues(5, 10, "gt")).toBeFalsy();
  });

  // "lt" (less than) comparison tests
  it("should return true if first number is less using lt", () => {
    expect(compareValues(3, 5, "lt")).toBeTruthy();
  });

  it("should return false if first number is not less using lt", () => {
    expect(compareValues(10, 5, "lt")).toBeFalsy();
  });

  // "ge" (greater than or equal to) comparison tests
  it("should return true if first number is greater or equal using ge", () => {
    expect(compareValues(5, 5, "ge")).toBeTruthy();
    expect(compareValues(10, 5, "ge")).toBeTruthy();
  });

  it("should return false if first number is not greater or equal using ge", () => {
    expect(compareValues(3, 5, "ge")).toBeFalsy();
  });

  // "le" (less than or equal to) comparison tests
  it("should return true if first number is less or equal using le", () => {
    expect(compareValues(5, 5, "le")).toBeTruthy();
    expect(compareValues(3, 5, "le")).toBeTruthy();
  });

  it("should return false if first number is not less or equal using le", () => {
    expect(compareValues(10, 5, "le")).toBeFalsy();
  });
});
