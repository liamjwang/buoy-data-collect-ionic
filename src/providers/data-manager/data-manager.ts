import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Injectable()
export class DataManagerProvider {

  constructor(private sqlite: SQLite) {
  }

  static db: SQLiteObject = null;

  initDb(): Promise<any> {
    if (DataManagerProvider.db === null) {
      return this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => { // TODO: Figure out why SQLiteObject rejects on success?!?!?!

        DataManagerProvider.db = db;
        db.executeSql("DROP TABLE Samples;").then().catch(e => e); // TODO: Remove this
        return db.executeSql("CREATE TABLE IF NOT EXISTS Samples (" +
          "id INTEGER PRIMARY KEY, " +
          "name VARCHAR(255), " +
          "description TEXT, " +
          "salinity FLOAT, " +
          "turbidity FLOAT, " +
          "ph FLOAT, " +
          "temperature FLOAT, " +
          "timestamp UNSIGNED BIG INT, " +
          "latitude DOUBLE, " +
          "longitude DOUBLE " +
          ");")
      }).catch(() => {
        return DataManagerProvider.db.executeSql("INSERT INTO Samples (name, temperature) VALUES ('cool', 3.14);")
      }).catch(() => {
        return DataManagerProvider.db.executeSql("INSERT INTO Samples (name, temperature) VALUES ('sick', 3.14);")
      }).catch(() => {
        return DataManagerProvider.db.executeSql("INSERT INTO Samples (name, temperature) VALUES ('wow', 3.14);")
      }).catch(e => {return e})
    } else {
      return Promise.resolve();
    }
  }

  getAllData(): Promise<any[]> {
    return DataManagerProvider.db.executeSql("SELECT * FROM Samples")
      .catch(e => {
        const data = [];
        for (let i = 0; i < e.rows.length; i++) {
          data.push(e.rows.item(i));
        }
        return data;
      });
  }

  deleteSampleByID(sampleID: number): Promise<any[]> {
    return DataManagerProvider.db.executeSql("DELETE FROM Samples WHERE id="+sampleID)
      .catch(e => {
        console.log("[Database] Info: Deleted sample with id "+sampleID);
        return e
      });
  }

  deleteAll(): Promise<any> {
    return DataManagerProvider.db.executeSql("DELETE FROM Samples")
      .catch(e => {
        console.log("[Database] Info: Deleted all samples");
        return e
      });
  }

  addSample(
    salinity: number,
    turbidity: number,
    ph: number,
    temperature: number,
    timestamp: number,
    longitude: number = null,
    latitude: number = null,
    name: string = "",
    description: string = ""
    ): Promise<any> {
    return this.initDb().then(() => {
      return DataManagerProvider.db.executeSql("INSERT INTO Samples VALUES " +
        "(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [name, description, salinity, turbidity, ph, temperature, timestamp, latitude, longitude])
        .catch(e => {
          console.log("[Data-Manager] Error: "+JSON.stringify(e))
        }).then(e => {
          console.log("[Database] Info: Added sample with id "+e.insertId);
          return e.insertId
      });
    });
  }
}
