import {
  idArg,
  inputObjectType,
  mutationField,
  nonNull,
  objectType,
  queryField,
} from "nexus";
import { User } from "./User";

export const Task = objectType({
  name: "Task",
  definition(t) {
    t.nonNull.uuid("id");
    t.nonNull.string("title");
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.boolean("done");
    t.field("assignee", {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.task
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .assignee();
      },
    });
  },
});

export const taskQueryField = queryField("task", {
  type: Task,
  args: {
    id: nonNull("UUID"),
  },

  resolve(_parent, args, ctx) {
    return ctx.prisma.task.findUnique({ where: { id: args.id } });
  },
});

export const CreateTaskPayload = objectType({
  name: "CreateTaskPayload",
  definition(t) {
    t.field("task", { type: Task });
  },
});

export const CreateTaskInput = inputObjectType({
  name: "CreateTaskInput",
  definition(t) {
    t.nonNull.string("sectionId");
    t.nonNull.string("title");
  },
});

export const createTask = mutationField("createTask", {
  type: CreateTaskPayload,
  args: {
    input: nonNull(CreateTaskInput),
  },
  resolve: async (_parent, { input }, ctx) => {
    const task = await ctx.prisma.task.create({
      data: {
        ...input,
      },
    });

    return {
      task,
    };
  },
});

export const UpdateTaskPayload = objectType({
  name: "UpdateTaskPayload",
  definition(t) {
    t.field("task", { type: Task });
  },
});

export const TaskInput = inputObjectType({
  name: "TaskInput",
  definition(t) {
    t.string("title");
    t.boolean("done");
  },
});

export const UpdateTaskInput = inputObjectType({
  name: "UpdateTaskInput",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("patch", { type: TaskInput });
  },
});

export const updateTask = mutationField("updateTask", {
  type: UpdateTaskPayload,
  args: {
    input: nonNull(UpdateTaskInput),
  },
  resolve: async (_parent, { input: { id, patch } }, ctx) => {
    const task = await ctx.prisma.task.update({
      where: { id },
      data: {
        title: patch.title || undefined,
        done: patch.done || undefined,
      },
    });

    return {
      task,
    };
  },
});

export const DeleteTaskPayload = objectType({
  name: "DeleteTaskPayload",
  definition(t) {
    t.field("task", { type: Task });
  },
});

export const deleteTask = mutationField("deleteTask", {
  type: DeleteTaskPayload,
  args: {
    id: nonNull(idArg()),
  },
  resolve: async (_parent, args, ctx) => {
    const task = await ctx.prisma.task.delete({ where: { id: args.id } });
    return { task };
  },
});

export const AssignUserToTaskPayload = objectType({
  name: "AssignUserToTaskPayload",
  definition(t) {
    t.field("task", { type: Task });
    t.field("user", { type: User });
  },
});

export const AssignUserToTaskInput = inputObjectType({
  name: "AssignUserToTaskInput",
  definition(t) {
    t.nonNull.string("taskId");
    t.nonNull.string("userId");
  },
});

export const assignUserToTask = mutationField("assignUserToTask", {
  type: AssignUserToTaskPayload,
  args: {
    input: nonNull(AssignUserToTaskInput),
  },
  resolve: async (_parent, { input: { taskId, userId } }, ctx) => {
    const task = await ctx.prisma.task.update({
      where: { id: taskId },
      data: {
        userId,
      },
    });

    const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

    return {
      task,
      user,
    };
  },
});
