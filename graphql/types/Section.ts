import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from "nexus";
import { Task } from "./Task";

export const Section = objectType({
  name: "Section",
  definition(t) {
    t.nonNull.uuid("id");
    t.nonNull.string("title");
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.list.field("tasks", {
      type: Task,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.section
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .tasks();
      },
    });
  },
});

export const sectionQueryField = queryField("section", {
  type: Section,
  args: {
    id: nonNull("UUID"),
  },

  resolve(_parent, args, ctx) {
    return ctx.prisma.section.findUnique({ where: { id: args.id } });
  },
});

export const CreateSectionPayload = objectType({
  name: "CreateSectionPayload",
  definition(t) {
    t.field("section", { type: Section });
  },
});

export const CreateSectionInput = inputObjectType({
  name: "CreateSectionInput",
  definition(t) {
    t.nonNull.string("projectId");
    t.nonNull.string("title");
  },
});

export const createSection = mutationField("createSection", {
  type: CreateSectionPayload,
  args: {
    input: nonNull(CreateSectionInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const section = await ctx.prisma.section.create({
      data: {
        ...input,
      },
    });

    return {
      section,
    };
  },
});

export const UpdateSectionPayload = objectType({
  name: "UpdateSectionPayload",
  definition(t) {
    t.field("section", { type: Section });
  },
});

export const SectionInput = inputObjectType({
  name: "SectionInput",
  definition(t) {
    t.string("title");
  },
});

export const UpdateSectionInput = inputObjectType({
  name: "UpdateSectionInput",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("patch", { type: SectionInput });
  },
});

export const updateSection = mutationField("updateSection", {
  type: UpdateSectionPayload,
  args: {
    input: nonNull(UpdateSectionInput),
  },
  resolve: async (_parent, { input: { id, patch } }, ctx) => {
    const section = await ctx.prisma.section.update({
      where: { id },
      data: {
        title: patch.title || undefined,
      },
    });

    return {
      section,
    };
  },
});

export const DeleteSectionPayload = objectType({
  name: "DeleteSectionPayload",
  definition(t) {
    t.field("section", { type: Section });
  },
});

export const deleteSection = mutationField("deleteSection", {
  type: DeleteSectionPayload,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (_parent, args, ctx) => {
    const section = await ctx.prisma.section.delete({ where: { id: args.id } });
    return { section };
  },
});
