import mongoose from "mongoose";

const applySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
  },
  nidNumber: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
  },
  file: {
    type: String,
  },
  note: {
    type: String,
    default: null,
  },
  bangladeshFormNo: {
    type: String,
  },
  attachment: {
    type: String,
  },
  serialNumber: {
    type: String,
  },
  paragraphNumber: {
    type: String,
  },
  landOfficeName: {
    type: String,
  },
  mouzaJLNo: {
    type: String,
  },
  upazilaThana: {
    type: String,
  },
  district: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  ownerShare: {
    type: String,
  },
  landCategory: {
    type: String,
  },
  landArea: {
    type: String,
  },
  plotNo: {
    type: String,
  },
  khatianNo: {
    type: String,
  },
  holdingNumber: {
    type: String,
  },
  arrearLastThreeYears: {
    type: String,
  },
  arrearPastThreeYears: {
    type: String,
  },
  interestAndCompensation: {
    type: String,
  },
  currentClaim: {
    type: String,
  },
  totalClaim: {
    type: String,
  },
  totalCollection: {
    type: String,
  },
  totalArrear: {
    type: String,
  },
  totalInWords: {
    type: String,
  },
  challanNo: {
    type: String,
  },
  dateBangla: {
    type: String,
  },
  dateEnglish: {
    type: String,
  },
  noteBl: {
    type: String,
  },
  registerOfficeAddress: {
    type: String,
  },
  upazilaOrCity: {
    type: String,
  },
  birthRegistrationNumber: {
    type: String,
  },
  leftBarcode: {
    type: String,
  },
  dateOfRegistration: {
    type: String,
  },
  dateOfIssuance: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
  },
  dateOfBirthInWords: {
    type: String,
  },
  nameInBangla: {
    type: String,
  },
  nameInEnglish: {
    type: String,
  },
  fatherNameInBangla: {
    type: String,
  },
  fatherNameInEnglish: {
    type: String,
  },
  fatherNationality: {
    type: String,
  },
  fatherNationalityBangla: {
    type: String,
  },
  motherNameInBangla: {
    type: String,
  },
  motherNameInEnglish: {
    type: String,
  },
  motherNationality: {
    type: String,
  },
  motherNationalityBangla: {
    type: String,
  },
  placeOfBirthInBangla: {
    type: String,
  },
  placeOfBirthInEnglish: {
    type: String,
  },
  permanentAddressInBangla: {
    type: String,
  },
  permanentAddressInEnglish: {
    type: String,
  },
  number: {
    type: String,
  },
  operator: {
    type: String,
  },
  name: {
    type: String,
  },
  identifier: {
    type: String,
  },
  formNumberNid: {
    type: String,
  },
  voterNumberNid: {
    type: String,
  },
  mobileNumberNid: {
    type: String,
  },
  birthCertificateNumberNid: {
    type: String,
  },
  fatherNidNumberNid: {
    type: String,
  },
  NameNid: {
    type: String,
  },
});

const Apply = mongoose.model("Apply", applySchema);

export default Apply;
