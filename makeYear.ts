import * as R from 'remeda';
import { makeFiles } from './makeFile';

const days = R.range(2, 26).map((v) => v.toString().padStart(2, '0'));

// days.forEach((day) => {
//   makeFiles('2021', day);
// });

// makeFiles('2021', '25');
