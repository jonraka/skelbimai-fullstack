import mysql from 'mysql2/promise';

const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export function sqlConnect(
  sql = '',
  data: (string | number)[] = []
): Promise<[any, mysql.FieldPacket[]]> {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection(connectionConfig);
      await connection.query(sql, data).then(resolve).catch(reject);
      await connection.end();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export function sqlConnectMulti(
  asyncCallback: (connection: mysql.Connection) => Promise<void>
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection(connectionConfig);
      await asyncCallback(connection).then(resolve).catch(reject);
      await connection.end();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
