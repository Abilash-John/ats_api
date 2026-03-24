const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Application",
    tableName: "applications",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        status: {
            type: "enum",
            enum: ["Applied", "Phone Screen", "Technical Interview", "HR Interview", "Offered", "Hired", "Rejected", "Withdrawn"],
            default: "Applied",
        },
        notes: {
            type: "text",
            nullable: true,
        },
        applicationDate: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
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
    indices: [
        {
            name: "unique_application_per_candidate_job",
            unique: true,
            columns: ["job", "candidate"],
        },
    ],
    relations: {
        job: {
            type: "many-to-one",
            target: "Job",
            inverseSide: "applications",
            joinColumn: { name: "job_id" },
            onDelete: "CASCADE",
        },
        candidate: {
            type: "many-to-one",
            target: "Candidate",
            inverseSide: "applications",
            joinColumn: { name: "candidate_id" },
            onDelete: "CASCADE",
        },
        interviews: {
            type: "one-to-many",
            target: "Interview",
            inverseSide: "application",
        },
    },
});
