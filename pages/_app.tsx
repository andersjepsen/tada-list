import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import client from "../lib/apollo";
import { GetProjectsQuery } from "../generated/graphql";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Content>
        <Component {...pageProps} />
      </Content>
    </ApolloProvider>
  );
}

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
    }
  }
`;

function Content({ children }: { children: React.ReactNode }) {
  const { data } = useQuery<GetProjectsQuery>(GET_PROJECTS);
  return (
    <div className="flex relative min-h-screen">
      <aside className="w-60 bg-gray-100 h-screen py-4 pl-4 border-r-2 border-r-gray-200">
        <div className="flex space-x-2 items-center text-xl font-bold pb-4">
          <div className="text-2xl">🎉</div>
          <h1>Tada List</h1>
        </div>
        <nav>
          <div className="border-b-2 border-b-gray-200 pb-2">
            <div className="flex justify-between items-center space-x-2 mr-2">
              <h1 className="font-bold pl-2">Projects</h1>
              <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
                +
              </button>
            </div>
          </div>
          <ul className="mr-2 py-2">
            {data?.projects.map((project) => (
              <li
                className="p-2 hover:bg-gray-200 rounded-lg"
                key={project?.id}
              >
                {project?.title}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <section className="flex-1 h-screen overflow-y-scroll px-4 py-2">
        {children}
      </section>
    </div>
  );
}

export default MyApp;
