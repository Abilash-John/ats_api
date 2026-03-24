const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Job",
    tableName: "jobs",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        title: {
            type: "varchar",
        },
        description: {
            type: "text",
            nullable: true,
        },
        location: {
            type: "varchar",
            nullable: true,
        },
        type: {
            type: "enum",
            enum: ["Full-time", "Part-time", "Contract", "Internship"],
            default: "Full-time",
        },
        department: {
            type: "varchar",
            nullable: true,
        },
        salaryRange: {
            type: "varchar",
            nullable: true,
        },
        status: {
            type: "enum",
            enum: ["Open", "Closed", "On Hold"],
            default: "Open",
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
        recruiter: {
            type: "many-to-one",
            target: "User",
            inverseSide: "jobs",
            joinColumn: { name: "recruiter_id" },
            onDelete: "SET NULL",
        },
        applications: {
            type: "one-to-many",
            target: "Application",
            inverseSide: "job",
        },
    },
});
