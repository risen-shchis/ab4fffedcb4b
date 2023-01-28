import crypto from "crypto";
import { deterministicPartitionKey } from "./dpk";

const testString = "foo bar";
const testData = { foo: "bar" };
const stringifiedTestData = JSON.stringify(testData);
const hashForTestData = crypto
  .createHash("sha3-512")
  .update(stringifiedTestData)
  .digest("hex");
const longData = { baz: "qux".repeat(1000) };
const hashForLongData = crypto
  .createHash("sha3-512")
  .update(JSON.stringify(longData))
  .digest("hex");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns hash of `event` when it is provided without `partitionKey`", () => {
    const key = deterministicPartitionKey(testData);
    expect(key).toBe(hashForTestData);
  });

  it("Returns provided `partitionKey` when it is string", () => {
    const key = deterministicPartitionKey({ partitionKey: testString });
    expect(key).toBe(testString);
  });

  it("Returns stringified `partitionKey` when it is not string", () => {
    const key = deterministicPartitionKey({ partitionKey: testData });
    expect(key).toBe(stringifiedTestData);
  });

  it("Returns hash of (maybe stringified) `partitionKey` when it is longer than limit", () => {
    const key = deterministicPartitionKey({ partitionKey: longData });
    expect(key).toBe(hashForLongData);
  });
});
