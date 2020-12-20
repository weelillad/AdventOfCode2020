#!/usr/bin/env ts-node-script

interface FieldWithValidation {
  fieldType: string;
  validationFn: (val: string) => boolean;
};

const compulsoryFields: Array<FieldWithValidation> = [
  {
    fieldType: "byr", validationFn: val => {
      const valNum = parseInt(val);
      return valNum >= 1920 && valNum <= 2002;
    }
  },
  {
    fieldType: "iyr", validationFn: val => {
      const valNum = parseInt(val);
      return valNum >= 2010 && valNum <= 2020;
    }
  },
  {
    fieldType: "eyr", validationFn: val => {
      const valNum = parseInt(val);
      return valNum >= 2020 && valNum <= 2030;
    }
  },
  {
    fieldType: "hgt", validationFn: val => {
      const unit = val.substring(val.length - 2);
      const valNum = parseInt(val.substring(0, val.length - 2));
      switch (unit) {
        case 'cm':
          return valNum >= 150 && valNum <= 193;
        case 'in':
          return valNum >= 59 && valNum <= 76;
        default:
          return false;
      };
    }
  },
  {
    fieldType: "hcl", validationFn: val => {
      return /^#[0-9a-f]{6}$/.test(val);
    }
  },
  {
    fieldType: "ecl", validationFn: val => {
      return /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(val);
    }
  },
  {
    fieldType: "pid", validationFn: val => {
      return /^[0-9]{9}$/.test(val);
    }
  }
];

const optionalFields: Array<FieldWithValidation> = [
  { fieldType: "cid", validationFn: val => true }
];

function checkPassportValidity(passportString: string, checkValues: boolean, allowMissingOptional: boolean): boolean {
  const expectedFields = allowMissingOptional
    ? compulsoryFields
    : compulsoryFields.concat(optionalFields);

  const passportFields = passportString.split(/\s+/);
  // console.log(passportFields);

  const validity = expectedFields.every(field => {
    // console.log(`Checking ${field.fieldType}`);
    const ans = passportFields.some(ppField => {
      return ppField.startsWith(field.fieldType)
        && (!checkValues || field.validationFn(ppField.substring(4)));
    });
    // console.log(ans);
    return ans;
  });

  // console.log(validity);
  return validity;
}

function day04Logic(data: string, checkValues: boolean): number {
  // Chop string into passport strings
  const passportStrings = data.split('\n\n');

  let validCount = 0;
  passportStrings.forEach(passportStr => {
    // console.log(passportStr);
    if (checkPassportValidity(passportStr, checkValues, true)) validCount++;
  });

  return validCount;
}

const day04TestData1: string =
  `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

const day04TestData2Invalid: string =
  `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`;

const day04TestData2Valid: string =
  `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`;

function day04Test() {
  console.log("TEST");
  console.log("Part 1: " + day04Logic(day04TestData1, false));
  console.log("Part 2a: " + day04Logic(day04TestData2Invalid, true));
  console.log("Part 2b: " + day04Logic(day04TestData2Valid, true));
}

function day04() {
  var fs = require('fs');

  const input: string = fs.readFileSync('./input04.txt', 'utf8');

  console.log("ACTUAL");
  console.log("Part 1: " + day04Logic(input, false));
  console.log("Part 2: " + day04Logic(input, true));
}

day04Test();
day04();
