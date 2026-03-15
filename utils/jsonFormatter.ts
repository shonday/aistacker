// utils/jsonFormatter.ts

export type JsonFormatMode = "pretty" | "minify";

export interface JsonFormatOptions {
  mode: JsonFormatMode;
  sortKeys?: boolean;
}

export interface JsonFormatError {
  message: string;
}

export interface JsonFormatResult {
  ok: boolean;
  output?: string;
  error?: JsonFormatError;
}

/**
 * Main JSON formatting function
 */
export function formatJson(
  input: string,
  options: JsonFormatOptions
): JsonFormatResult {
  if (!input.trim()) {
    return {
      ok: true,
      output: "",
    };
  }

  try {
    const parsed = JSON.parse(input);

    const processed = options.sortKeys ? sortJsonKeys(parsed) : parsed;
    const space = options.mode === "pretty" ? 2 : 0;

    const output = JSON.stringify(processed, null, space);

    return {
      ok: true,
      output,
    };
  } catch (e: any) {
    return {
      ok: false,
      error: {
        message: e?.message ?? "Invalid JSON input.",
      },
    };
  }
}

/**
 * Recursively sort object keys
 */
export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }

  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortJsonKeys(
          (value as Record<string, unknown>)[key]
        ) as unknown;
        return acc;
      }, {});
  }

  return value;
}