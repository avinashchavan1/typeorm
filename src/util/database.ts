import { Connection, createConnection } from "typeorm";

export async function getDatabaseConnection() {
  return await createConnection();
}
