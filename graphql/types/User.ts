import { extendType, nonNull, objectType, queryField } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.uuid("id");
    t.string("name");
    t.email("email");
    t.dateTime("createdAt");
  },
});

export const usersQueryField = queryField((t) => {
  t.nonNull.list.field("users", {
    type: User,

    resolve(_parent, _args, ctx) {
      return ctx.prisma.user.findMany();
    },
  });
});

export const userQueryField = queryField("user", {
  type: User,
  args: {
    id: nonNull("UUID"),
  },

  resolve(_parent, args, ctx) {
    return ctx.prisma.user.findUnique({ where: { id: args.id } });
  },
});
