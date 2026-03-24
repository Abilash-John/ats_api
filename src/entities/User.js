const { EntitySchema } = require("typeorm");
const bcrypt = require("bcryptjs");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        userName: {
            type: "varchar",
            unique: true,
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
            select: false,
        },
        firstName: {
            type: "varchar",
            nullable: true,
        },
        lastName: {
            type: "varchar",
            nullable: true,
        },
        role: {
            type: "enum",
            enum: ["Admin", "Recruiter", "Manager"],
            default: "Recruiter",
        },
        isActive: {
            type: "boolean",
            default: true,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        jobs: {
            type: "one-to-many",
            target: "Job",
            inverseSide: "recruiter",
        },
        interviews: {
            type: "one-to-many",
            target: "Interview",
            inverseSide: "interviewer",
        },
    },
});
