PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "startTime" TEXT NOT NULL,
    "cutoffTime" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'all',
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "capacity" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Group_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Group" (
    "id",
    "eventId",
    "name",
    "distance",
    "startTime",
    "cutoffTime",
    "gender",
    "minAge",
    "maxAge",
    "capacity",
    "fee",
    "isOpen",
    "createdAt",
    "updatedAt"
)
SELECT
    g."id",
    s."eventId",
    CASE
        WHEN g."name" IS NULL OR g."name" = '' THEN s."name"
        ELSE s."name" || ' - ' || g."name"
    END,
    s."distance",
    s."startTime",
    s."cutoffTime",
    g."gender",
    g."minAge",
    g."maxAge",
    g."capacity",
    g."fee",
    g."isOpen",
    g."createdAt",
    g."updatedAt"
FROM "Group" g
JOIN "Schedule" s ON s."id" = g."scheduleId";

DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
DROP TABLE "Schedule";

PRAGMA foreign_keys=ON;