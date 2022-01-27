import { PrismaClient } from "@prisma/client";
import { projects, sections, tasks } from "../data";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: projects,
  });

  await prisma.section.createMany({
    data: sections,
  });

  await prisma.task.createMany({
    data: tasks,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
