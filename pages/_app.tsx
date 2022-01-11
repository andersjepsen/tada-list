import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import client from "../lib/apollo";
import { GetProjectsQuery } from "../generated/graphql";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>🎉 Tada List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
  const { data, loading, error } = useQuery<GetProjectsQuery>(GET_PROJECTS);

  const router = useRouter();

  const projectId = router.query?.projectId?.toString() ?? "";

  if (error) {
    throw error;
  }

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100 h-screen py-4 pl-4 border-r-2 border-r-gray-200">
        <Link href="/" passHref>
          <div className="flex space-x-2 items-center text-xl font-bold pb-4 hover:cursor-pointer">
            <div className="text-2xl">🎉</div>
            <h1>Tada List</h1>
          </div>
        </Link>
        <nav>
          <div className="border-b-2 border-b-gray-200 pb-2">
            <div className="flex justify-between items-center space-x-2 mr-2">
              <h1 className="font-bold pl-2">Projects</h1>
              <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <ul className="mr-2 py-2">
            {data?.projects.map((project) => (
              <Link
                href={`/projects/${encodeURIComponent(project?.id ?? "")}`}
                key={project?.id}
                passHref
              >
                <li
                  className={`p-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer ${
                    projectId === project?.id ? "bg-gray-50 font-semibold" : ""
                  }`}
                >
                  {project?.title}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </aside>
      <section className="flex-1 h-screen overflow-y-scroll p-4">
        {children}
      </section>
    </div>
  );
}

export default MyApp;
