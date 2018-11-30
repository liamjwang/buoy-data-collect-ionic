import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

@Injectable()
export class DataManagerProvider {

  constructor(private sqlite: SQLite) {
  }

  static db: SQLiteObject = null;

  private initDb(): Promise<any> {
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
      }).catch(e => e) // TODO: For some reason this rejects on success. WHy???
    } else {
      return Promise.resolve();
    }
  }

  getAllData(): Promise<any[]> {
    return this.initDb().then(() => {
      return DataManagerProvider.db.executeSql("SELECT * FROM Samples")
    }).catch(e => {
        const data = [];
        for (let i = 0; i < e.rows.length; i++) {
          data.push(e.rows.item(i));
        }
        return data;
      });
  }

  getSampleByID(sampleID: number): Promise<any> {
    return this.initDb().then(() => {
      return this.getAllData()
    }).then(sampleArr => {
      var result = sampleArr.filter(obj => {
        return obj.id === sampleID;
      });
      return result[0];
    })
  }

  deleteSampleByID(sampleID: number): Promise<any[]> {
    return this.initDb().then(() => {
      return DataManagerProvider.db.executeSql("DELETE FROM Samples WHERE id=" + sampleID)
    }).catch(e => {
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
    latitude: number = null,
    longitude: number = null,
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

  updateSampleNameDescription(id: number, name: string, description: string) {
    return this.initDb().then(() => {
      return DataManagerProvider.db.executeSql("UPDATE Samples "+
      "SET name = ?, description = ? "+
      "WHERE id = ?;",
        [name, description, id])
        .catch(e => {
          console.log("[Data-Manager-Update] Error: "+JSON.stringify(e))
        }).then(e => {
          console.log("[Data-Manager-Update] asdf: "+JSON.stringify(e));
          // console.log("[Database] Info: Updated sample with id "+e.insertId);
          // return e.insertId
        });
    });
  }
}
