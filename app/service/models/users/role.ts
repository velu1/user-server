
import mongoose from "mongoose";

module.exports = (connection: any) => {
    const schema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: [true, "Role name is required"],
                min: [3, "Must be at least 3 character,got {VALUE}"],
            },
            description: {
                type: String,
                required: true,
                min: [3, "Must be at least 3 character,got {VALUE}"],
            },
            rolePermission: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "dashboardcard",
                required: true,
                },
            ],
            defaultRole: {
                type: Boolean,
                default: false,
            },
            
            isDeleted: {
                type: Boolean,
                default: false,
            },
            },
        { timestamps: true, strict: true }
    );

    schema.method("toJSON", function (this: any) {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Role = connection.model("role", schema);
    return Role;
};
