
import mongoose from "mongoose";

module.exports = (connection: any) => {
    const schema = new mongoose.Schema(
        {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      default: { type: Boolean },
      type: { type: String },
    },
        { timestamps: true, strict: true }
    );

    schema.method("toJSON", function (this: any) {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const DashboardCard = connection.model("dashboardcard", schema);
    return DashboardCard;
};
