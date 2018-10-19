import {Injectable} from '@angular/core';

/*
  Generated class for the DataManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataManagerProvider {

  constructor() {
    console.log();
  }

  selected: any;

  allData: any = [
    {
      id: 9777558,
      stamp: "9/23/2018 10:33:36",
      name: "Sample 1",
      description: "Description 1",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 37,
      turbidity: 131,
      ph: 8.970926781,
      temperature: 10
    },
    {
      id: 1753840,
      stamp: "9/23/2018 10:33:37",
      name: "Sample 2",
      description: "Description 2",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 32,
      turbidity: 57,
      ph: 7.596151523,
      temperature: 20
    },
    {
      id: 1053295,
      stamp: "9/23/2018 10:33:38",
      name: "Sample 3",
      description: "Description 3",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 32,
      turbidity: 160,
      ph: 8.992664152,
      temperature: 18
    },
    {
      id: 4322826,
      stamp: "9/23/2018 10:33:39",
      name: "Sample 4",
      description: "Description 4",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 38,
      turbidity: 90,
      ph: 8.446083464,
      temperature: 13
    },
    {
      id: 6335086,
      stamp: "9/23/2018 10:33:40",
      name: "Sample 5",
      description: "Description 5",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 35,
      turbidity: 18,
      ph: 8.075318885,
      temperature: 20
    },
    {
      id: 5853538,
      stamp: "9/23/2018 10:33:41",
      name: "Sample 6",
      description: "Description 6",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 33,
      turbidity: 140,
      ph: 8.920255279,
      temperature: 13
    },
    {
      id: 8805087,
      stamp: "9/23/2018 10:33:43",
      name: "Sample 7",
      description: "Description 7",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 36,
      turbidity: 58,
      ph: 7.18537702,
      temperature: 24
    },
    {
      id: 8012708,
      stamp: "9/23/2018 10:33:44",
      name: "Sample 8",
      description: "Description 8",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 32,
      turbidity: 77,
      ph: 7.099597212,
      temperature: 25
    },
    {
      id: 7095506,
      stamp: "9/23/2018 10:33:45",
      name: "Sample 9",
      description: "Description 9",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 34,
      turbidity: 31,
      ph: 8.25294888,
      temperature: 21
    },
    {
      id: 8296394,
      stamp: "9/23/2018 10:33:46",
      name: "Sample 10",
      description: "Description 10",
      lat: 45.5478683,
      long: -122.791471,
      locacc: 16.665000915527344,
      salinity: 37,
      turbidity: 33,
      ph: 8.983685639,
      temperature: 28
    },
    {
      id: 4467890,
      stamp: "9/23/2018 10:38:20",
      name: "Sample 11",
      description: "Description 11",
      lat: 45.5478593,
      long: -122.7914768,
      locacc: 16.381999969482422,
      salinity: 34,
      turbidity: 108,
      ph: 7.414729236,
      temperature: 14
    }
  ];

}
