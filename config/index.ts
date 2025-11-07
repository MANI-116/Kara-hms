import fs from "fs";
import path from "path";

export interface AppConfig {
  googleSheets: {
    enabled: boolean;
    spreadsheetId: string;
    serviceAccountKeyPath: string;
    sheets: {
      patients: {
        name: string;
        range: string;
        columns: string[];
      };
      ip: {
        name: string;
        range: string;
        columns: string[];
      };
    };
  };
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  const output: any = { ...base };
  for (const key in override) {
    const baseVal = (base as any)[key];
    const overrideVal = (override as any)[key];

    if (overrideVal && typeof overrideVal === "object" && !Array.isArray(overrideVal)) {
      output[key] = deepMerge(baseVal || {}, overrideVal);
    } else if (overrideVal !== undefined) {
      output[key] = overrideVal;
    }
  }
  return output;
}

export function loadConfig(): AppConfig {
  const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
  const basePath = path.join(__dirname, "config.base.json");
  const envPath = path.join(__dirname, `config.${env}.json`);

  const baseConfig = JSON.parse(fs.readFileSync(basePath, "utf8"));
  const envConfig = fs.existsSync(envPath)
    ? JSON.parse(fs.readFileSync(envPath, "utf8"))
    : {};

  const finalConfig = deepMerge(baseConfig, envConfig);

  console.log(
    `[config] Environment: ${env.toUpperCase()} | Sheet: ${finalConfig.googleSheets.spreadsheetId}`
  );

  if (!finalConfig.googleSheets.serviceAccountKeyPath) {
    throw new Error(`Missing Google serviceAccountKeyPath in ${envPath}`);
  }

  return finalConfig as AppConfig;
}
