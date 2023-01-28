import crypto from "crypto";

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

interface MessageEvent {
  partitionKey?: unknown;
  [key: string]: unknown;
}

const hexHash = (data: string) =>
  crypto.createHash("sha3-512").update(data).digest("hex");

export const deterministicPartitionKey = (event?: MessageEvent) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (!event.partitionKey) {
    return hexHash(JSON.stringify(event));
  }

  const { partitionKey } = event;
  const partitionKeyString =
    typeof partitionKey === "string"
      ? partitionKey
      : JSON.stringify(partitionKey);

  return partitionKeyString.length > MAX_PARTITION_KEY_LENGTH
    ? hexHash(partitionKeyString)
    : partitionKeyString;
};
