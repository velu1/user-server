
import mongoose from "mongoose";

module.exports = (connection: any) => {
    const schema = new mongoose.Schema(
        {
            email: {
                type: String,
                required: true,
            },
            phoneNumber: {
                type: String,
                max: [10, "Phone number must be 10 digits,got {VALUE}"],
            },
            password: {
                type: Number,
            },
            firstName: {
                type: String,
            },
            lastName: {
                type: String
            },
            role: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "role",
                required: true,
            },
            isSuperAdmin: { type: Boolean, default: false },
            // tenantCode: { type: String, required: true },
            isActive: { type: Boolean, default: true },
            isDeleted: { type: Boolean, default: false },
        },
        { timestamps: true, strict: true }
    );

    schema.method("toJSON", function (this: any) {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const User = connection.model("User", schema);
    return User;
};
