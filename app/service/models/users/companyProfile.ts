import mongoose from "mongoose";

module.exports = (connection: any) => {
  const schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        max: [10, "Phone number must be 10 digits,got {VALUE}"],
      },
      gstin: {
        type: String,
      },
      cin: {
        type: String,
      },
      address: {
        type: String,
        require: true,
      },
      pinCode: {
        type: String,
        require: true,
      },
      partsInNamingSeries: {
        type: String,
        require: true,
      },
      image: {
        type: String,
      },
    },
    { timestamps: true, strict: true }
  );

  schema.method("toJSON", function (this: any) {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const CompanyProfile = connection.model("companyprofile", schema);
  return CompanyProfile;
};
