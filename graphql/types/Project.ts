import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from "nexus";
import { Section } from "./Section";
import { User } from "./User";

export const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.uuid("id");
    t.nonNull.string("title");
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.string("description");
    t.nonNull.list.field("users", {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.project
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .users();
      },
    });

    t.nonNull.list.field("sections", {
      type: nonNull(Section),
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.project
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .sections({ orderBy: [{ createdAt: "asc" }] });
      },
    });
  },
});

export const projectsQueryField = queryField((t) => {
  t.nonNull.list.field("projects", {
    type: nonNull(Project),

    resolve(_parent, _args, ctx) {
      return ctx.prisma.project.findMany({ orderBy: [{ createdAt: "asc" }] });
    },
  });
});

export const projectQueryField = queryField("project", {
  type: Project,
  args: {
    id: nonNull("UUID"),
  },

  resolve(_parent, args, ctx) {
    return ctx.prisma.project.findUnique({ where: { id: args.id } });
  },
});

export const CreateProjectPayload = objectType({
  name: "CreateProjectPayload",
  definition(t) {
    t.field("project", { type: Project });
  },
});

export const CreateProjectInput = inputObjectType({
  name: "CreateProjectInput",
  definition(t) {
    t.nonNull.string("title");
    t.string("description");
  },
});

export const createProject = mutationField("createProject", {
  type: CreateProjectPayload,
  args: {
    input: nonNull(CreateProjectInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const project = await ctx.prisma.project.create({
      data: {
        ...input,
      },
    });

    return {
      project,
    };
  },
});

export const UpdateProjectPayload = objectType({
  name: "UpdateProjectPayload",
  definition(t) {
    t.field("project", { type: Project });
  },
});

export const ProjectInput = inputObjectType({
  name: "ProjectInput",
  definition(t) {
    t.string("title");
    t.string("description");
  },
});

export const UpdateProjectInput = inputObjectType({
  name: "UpdateProjectInput",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("patch", { type: ProjectInput });
  },
});

export const updateProject = mutationField("updateProject", {
  type: UpdateProjectPayload,
  args: {
    input: nonNull(UpdateProjectInput),
  },
  resolve: async (_parent, { input: { id, patch } }, ctx) => {
    const project = await ctx.prisma.project.update({
      where: { id },
      data: {
        title: patch.title || undefined,
        description: patch.description,
      },
    });

    return {
      project,
    };
  },
});

export const DeleteProjectPayload = objectType({
  name: "DeleteProjectPayload",
  definition(t) {
    t.field("project", { type: Project });
  },
});

export const deleteProject = mutationField("deleteProject", {
  type: DeleteProjectPayload,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (_parent, args, ctx) => {
    const project = await ctx.prisma.project.delete({ where: { id: args.id } });
    return { project };
  },
});
