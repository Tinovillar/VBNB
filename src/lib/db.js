import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Abrir o crear la base local
export async function openDB() {
  return open({
    filename: "db/db.db",
    driver: sqlite3.Database,
  });
}

// Ejecutar SELECT (varios resultados)
export async function query(sql, params = []) {
  const db = await openDB();
  const result = await db.all(sql, params);
  await db.close();
  return result;
}

// Ejecutar SELECT (un solo resultado)
export async function get(sql, params = []) {
  const db = await openDB();
  const result = await db.get(sql, params);
  await db.close();
  return result;
}

// Ejecutar INSERT, UPDATE o DELETE
export async function run(sql, params = []) {
  const db = await openDB();
  const result = await db.run(sql, params);
  await db.close();
  return result;
}
