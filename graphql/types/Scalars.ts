import {
  DateTimeResolver,
  EmailAddressResolver,
  UUIDResolver,
} from "graphql-scalars";
import { asNexusMethod } from "nexus";

export const EmailAddress = asNexusMethod(
  EmailAddressResolver,
  "email",
  "string"
);

export const UUID = asNexusMethod(UUIDResolver, "uuid", "string");

export const DateTime = asNexusMethod(DateTimeResolver, "dateTime", "Date");
