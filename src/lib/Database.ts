"use server-only";

import { doubleReturn } from "@/typings/globalTypes";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

declare global {
  var database: Database;
}

type databaseT = SupabaseClient<any, "public", any>;

// * Class for connecting to supabase database
// * It works as a singleton class by using globalThis

// * Only exception is nextauth api route
// * I could not figure out why

class Database {
  constructor() {
    console.log("database class created");
  }

  private database: databaseT | null = null;

  private async createConnection(): Promise<doubleReturn<databaseT>> {
    const supaBaseUrl = process.env.SUPABASE_URL;
    const supaBaseKey = process.env.SUPABASE_KEY;

    if (supaBaseUrl === undefined || supaBaseKey === undefined) {
      return await {
        status: false,
        message: "process environment variables could not be read",
      };
    }

    console.log("database connection created");
    return {
      status: true,
      value: createClient(supaBaseUrl, supaBaseKey),
    };
  }

  async getDatabase(): Promise<doubleReturn<databaseT>> {
    if (this.database !== null) {
      console.log("accessed to database");
      return {
        status: true,
        value: this.database,
      };
    } else {
      const connection = await this.createConnection();
      if (connection.status) {
        ``;
        this.database = connection.value;
        console.log("accessed to database");
        return {
          status: true,
          value: this.database,
        };
      } else {
        console.log("failed to access database");
        return {
          status: false,
          message: connection.message,
        };
      }
    }
  }
}

if (!globalThis.database) globalThis.database = await new Database();

export default await globalThis.database;
