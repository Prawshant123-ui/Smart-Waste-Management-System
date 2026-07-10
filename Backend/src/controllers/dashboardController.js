const prisma = require("../config/prisma");

const getAdminDashboard = async (req, res) => {
  try {
    const [totalBins, totalComplaints, totalCollectors, totalVehicles] = await Promise.all([
      prisma.bin.count(),
      prisma.complaint.count(),
      prisma.user.count({ where: { role: "COLLECTOR" } }),
      prisma.vehicle.count(),
    ]);

    const complaintsByStatus = await prisma.complaint.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const binsByStatus = await prisma.bin.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const overflowHotspots = await prisma.bin.findMany({
      where: { status: { in: ["FULL", "OVERFLOWING"] } },
      select: { id: true, address: true, latitude: true, longitude: true, status: true },
      orderBy: { status: "desc" },
    });

    const complaintsPerDay = await prisma.$queryRaw`
      SELECT DATE("createdAt") AS date, COUNT(*)::int AS count
      FROM "Complaint"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const avgCollectionTimeResult = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM ("endTime" - "startTime")) / 60)::float AS "avgMinutes"
      FROM "Collection"
      WHERE "endTime" IS NOT NULL AND "startTime" IS NOT NULL
    `;
    const avgCollectionTime = avgCollectionTimeResult[0]?.avgMinutes || 0;

    const collectorPerformanceRaw = await prisma.$queryRaw`
      SELECT
        u.id AS "collectorId",
        u.name AS "collectorName",
        COUNT(c.id)::int AS "totalTasks",
        COUNT(c.id) FILTER (WHERE c.status = 'COMPLETED')::int AS "completedTasks",
        AVG(EXTRACT(EPOCH FROM (c."endTime" - c."startTime")) / 60)
          FILTER (WHERE c."endTime" IS NOT NULL)::float AS "avgMinutesPerTask"
      FROM "User" u
      LEFT JOIN "Collection" c ON c."collectorId" = u.id
      WHERE u.role = 'COLLECTOR'
      GROUP BY u.id, u.name
      ORDER BY "completedTasks" DESC
    `;

    const vehicleUtilization = await prisma.$queryRaw`
      SELECT
        v.id AS "vehicleId",
        v."vehicleNumber",
        v.status,
        COUNT(c.id)::int AS "totalTrips"
      FROM "Vehicle" v
      LEFT JOIN "Collection" c ON c."vehicleId" = v.id
      GROUP BY v.id, v."vehicleNumber", v.status
      ORDER BY "totalTrips" DESC
    `;

    const resolvedCount = await prisma.complaint.count({ where: { status: "RESOLVED" } });
    const resolutionRate = totalComplaints > 0 ? (resolvedCount / totalComplaints) * 100 : 0;

    return res.status(200).json({
      totals: { totalBins, totalComplaints, totalCollectors, totalVehicles },
      complaintsByStatus,
      binsByStatus,
      overflowHotspots,
      complaintsPerDay,
      avgCollectionTime: Math.round(avgCollectionTime * 10) / 10,
      collectorPerformance: collectorPerformanceRaw,
      vehicleUtilization,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load admin dashboard" });
  }
};

const getCollectorDashboard = async (req, res) => {
  try {
    const collectorId = req.user.id;

    const [totalTasks, completedTasks, inProgressTasks, assignedTasks] = await Promise.all([
      prisma.collection.count({ where: { collectorId } }),
      prisma.collection.count({ where: { collectorId, status: "COMPLETED" } }),
      prisma.collection.count({ where: { collectorId, status: "IN_PROGRESS" } }),
      prisma.collection.count({ where: { collectorId, status: "ASSIGNED" } }),
    ]);

    const avgTimeResult = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM ("endTime" - "startTime")) / 60)::float AS "avgMinutes"
      FROM "Collection"
      WHERE "collectorId" = ${collectorId} AND "endTime" IS NOT NULL
    `;
    const avgMinutesPerTask = avgTimeResult[0]?.avgMinutes || 0;

    const recentTasks = await prisma.collection.findMany({
      where: { collectorId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { bin: true, vehicle: true },
    });

    return res.status(200).json({
      totals: { totalTasks, completedTasks, inProgressTasks, assignedTasks },
      avgMinutesPerTask: Math.round(avgMinutesPerTask * 10) / 10,
      recentTasks,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load collector dashboard" });
  }
};

const getCitizenDashboard = async (req, res) => {
  try {
    const citizenId = req.user.id;

    const [totalComplaints, resolvedComplaints, pendingComplaints] = await Promise.all([
      prisma.complaint.count({ where: { citizenId } }),
      prisma.complaint.count({ where: { citizenId, status: "RESOLVED" } }),
      prisma.complaint.count({ where: { citizenId, status: { in: ["PENDING", "APPROVED", "ASSIGNED"] } } }),
    ]);

    const recentComplaints = await prisma.complaint.findMany({
      where: { citizenId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { bin: true },
    });

    return res.status(200).json({
      totals: { totalComplaints, resolvedComplaints, pendingComplaints },
      recentComplaints,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load citizen dashboard" });
  }
};

module.exports = { getAdminDashboard, getCollectorDashboard, getCitizenDashboard };