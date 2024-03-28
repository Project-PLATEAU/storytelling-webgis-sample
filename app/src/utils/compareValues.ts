export type ComparisonType = "eq" | "gt" | "lt" | "ge" | "le";

export const compareValues = (
  value: unknown,
  conditionValue: unknown,
  comparisonType: ComparisonType,
): boolean => {
  if (comparisonType === "eq") {
    return value === conditionValue;
  }

  const numValue = Number(value);
  const numConditionValue = Number(conditionValue);

  if (!isNaN(numValue) && !isNaN(numConditionValue)) {
    switch (comparisonType) {
      case "gt":
        return numValue > numConditionValue;
      case "lt":
        return numValue < numConditionValue;
      case "ge":
        return numValue >= numConditionValue;
      case "le":
        return numValue <= numConditionValue;
      default:
        throw new Error(`Unknown comparison type: ${comparisonType}`);
    }
  }

  return false;
};
