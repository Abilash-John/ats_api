const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Candidate",
    tableName: "candidates",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        firstName: {
            type: "varchar",
        },
        lastName: {
            type: "varchar",
        },
        email: {
            type: "varchar",
            unique: true,
        },
        phone: {
            type: "varchar",
            nullable: true,
        },
        resumeUrl: {
            type: "varchar",
            nullable: true,
        },
        experienceYears: {
            type: "int",
            default: 0,
        },
        skills: {
            type: "json",
            nullable: true,
        },
        status: {
            type: "enum",
            enum: ["Applied", "Screening", "Interview", "Offered", "Rejected", "Hired"],
            default: "Applied",
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
        applications: {
            type: "one-to-many",
            target: "Application",
            inverseSide: "candidate",
        },
    },
});
