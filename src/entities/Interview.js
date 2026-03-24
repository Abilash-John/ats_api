const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Interview",
    tableName: "interviews",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        interviewType: {
            type: "enum",
            enum: ["Phone", "Technical", "HR", "On-site", "Video"],
            default: "Technical",
        },
        scheduledAt: {
            type: "timestamp",
        },
        durationMinutes: {
            type: "int",
            default: 60,
        },
        meetingLink: {
            type: "varchar",
            nullable: true,
        },
        feedback: {
            type: "text",
            nullable: true,
        },
        rating: {
            type: "int",
            nullable: true,
        },
        status: {
            type: "enum",
            enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
            default: "Scheduled",
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
        application: {
            type: "many-to-one",
            target: "Application",
            inverseSide: "interviews",
            joinColumn: { name: "application_id" },
            onDelete: "CASCADE",
        },
        interviewer: {
            type: "many-to-one",
            target: "User",
            inverseSide: "interviews",
            joinColumn: { name: "interviewer_id" },
            onDelete: "SET NULL",
        },
    },
});
