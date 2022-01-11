export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: string;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: string;
};

export type AssignUserToTaskInput = {
  taskId: Scalars['String'];
  userId: Scalars['String'];
};

export type AssignUserToTaskPayload = {
  __typename?: 'AssignUserToTaskPayload';
  task?: Maybe<Task>;
  user?: Maybe<User>;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateProjectPayload = {
  __typename?: 'CreateProjectPayload';
  project?: Maybe<Project>;
};

export type CreateSectionInput = {
  projectId: Scalars['String'];
  title: Scalars['String'];
};

export type CreateSectionPayload = {
  __typename?: 'CreateSectionPayload';
  section?: Maybe<Section>;
};

export type CreateTaskInput = {
  sectionId: Scalars['String'];
  title: Scalars['String'];
};

export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  task?: Maybe<Task>;
};

export type DeleteProjectPayload = {
  __typename?: 'DeleteProjectPayload';
  project?: Maybe<Project>;
};

export type DeleteSectionPayload = {
  __typename?: 'DeleteSectionPayload';
  section?: Maybe<Section>;
};

export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  task?: Maybe<Task>;
};

export type Mutation = {
  __typename?: 'Mutation';
  assignUserToTask?: Maybe<AssignUserToTaskPayload>;
  createProject?: Maybe<CreateProjectPayload>;
  createSection?: Maybe<CreateSectionPayload>;
  createTask?: Maybe<CreateTaskPayload>;
  deleteProject?: Maybe<DeleteProjectPayload>;
  deleteSection?: Maybe<DeleteSectionPayload>;
  deleteTask?: Maybe<DeleteTaskPayload>;
  updateProject?: Maybe<UpdateProjectPayload>;
  updateSection?: Maybe<UpdateSectionPayload>;
  updateTask?: Maybe<UpdateTaskPayload>;
};


export type MutationAssignUserToTaskArgs = {
  input: AssignUserToTaskInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateSectionArgs = {
  input: CreateSectionInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSectionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['UUID'];
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateSectionArgs = {
  input: UpdateSectionInput;
};


export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  sections: Array<Section>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  users: Array<Maybe<User>>;
};

export type ProjectInput = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects: Array<Project>;
  section?: Maybe<Section>;
  task?: Maybe<Task>;
  user?: Maybe<User>;
  users: Array<Maybe<User>>;
};


export type QueryProjectArgs = {
  id: Scalars['UUID'];
};


export type QuerySectionArgs = {
  id: Scalars['UUID'];
};


export type QueryTaskArgs = {
  id: Scalars['UUID'];
};


export type QueryUserArgs = {
  id: Scalars['UUID'];
};

export type Section = {
  __typename?: 'Section';
  createdAt: Scalars['DateTime'];
  id: Scalars['UUID'];
  tasks: Array<Task>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type SectionInput = {
  title?: InputMaybe<Scalars['String']>;
};

export type Task = {
  __typename?: 'Task';
  assignee?: Maybe<User>;
  createdAt: Scalars['DateTime'];
  done: Scalars['Boolean'];
  id: Scalars['UUID'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type TaskInput = {
  done?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  id: Scalars['String'];
  patch: ProjectInput;
};

export type UpdateProjectPayload = {
  __typename?: 'UpdateProjectPayload';
  project?: Maybe<Project>;
};

export type UpdateSectionInput = {
  id: Scalars['String'];
  patch: SectionInput;
};

export type UpdateSectionPayload = {
  __typename?: 'UpdateSectionPayload';
  section?: Maybe<Section>;
};

export type UpdateTaskInput = {
  id: Scalars['String'];
  patch: TaskInput;
};

export type UpdateTaskPayload = {
  __typename?: 'UpdateTaskPayload';
  task?: Maybe<Task>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['EmailAddress']>;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
};

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'CreateProjectPayload', project?: { __typename?: 'Project', id: string, title: string } | null | undefined } | null | undefined };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', id: string, title: string }> };

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'CreateTaskPayload', task?: { __typename?: 'Task', id: string, title: string } | null | undefined } | null | undefined };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: { __typename?: 'DeleteTaskPayload', task?: { __typename?: 'Task', id: string } | null | undefined } | null | undefined };

export type UpdateSectionMutationVariables = Exact<{
  input: UpdateSectionInput;
}>;


export type UpdateSectionMutation = { __typename?: 'Mutation', updateSection?: { __typename?: 'UpdateSectionPayload', section?: { __typename?: 'Section', id: string, title: string } | null | undefined } | null | undefined };

export type ProjectSectionFragment = { __typename?: 'Section', id: string, title: string, tasks: Array<{ __typename?: 'Task', id: string, title: string }> };

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'UpdateProjectPayload', project?: { __typename?: 'Project', id: string, title: string } | null | undefined } | null | undefined };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', id: string, title: string, sections: Array<{ __typename?: 'Section', id: string, title: string, tasks: Array<{ __typename?: 'Task', id: string, title: string }> }> } | null | undefined };
