/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import axios from "axios";
import { convertLessonsGql } from "gql-api-helpers";
import {
  AppConfig,
  Connection,
  GqlLesson,
  Lesson,
  UserAccessToken,
} from "types";

export const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || "/graphql/graphql";
export const TUTOR_ENDPOINT = process.env.TUTOR_ENDPOINT || "/tutor";
export const ADMIN_ENDPOINT = process.env.ADMIN_ENDPOINT || "/admin";

interface GQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

interface GQLResponse<T> {
  errors?: { message: string }[];
  data?: T;
}

async function fetchGql<T>(
  req: GQLRequest,
  headers?: Record<string, string>
): Promise<T> {
  const result = await axios.post<GQLResponse<T>>(GRAPHQL_ENDPOINT, req, {
    headers: headers || {},
  });
  if (!result.data.data) {
    throw new Error(
      Array.isArray(result.data.errors)
        ? JSON.stringify(result.data.errors)
        : `failed to return expected data for query ${JSON.stringify(req)}`
    );
  }
  return result.data.data;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  const result = await fetchGql<{ appConfig: AppConfig }>({
    query: `
      query FetchAppConfig {
        appConfig {
          googleClientId
          logoIcon
          logoLargeIcon
          featuredLessons
        }
      }
    `,
  });
  return result.appConfig;
}

export async function fetchLessons(config?: AppConfig): Promise<Lesson[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filter: any = { media: { $nin: [null, ""] }, "media.type": "image" };
  if (config && config.featuredLessons?.length > 0) {
    filter = { lessonId: { $in: config.featuredLessons } };
  }
  const result = await fetchGql<{ lessons: Connection<GqlLesson> }>({
    query: `
      query Lessons($filter: String!) {
        lessons(
          filter: $filter,
          sortBy: "updatedAt",
          limit: 10,
        ) {
          edges {
            node {
              lessonId
              name
              media {
                type
                url
                props {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      filter: JSON.stringify(filter),
    },
  });
  return convertLessonsGql(result.lessons.edges.map((edge) => edge.node));
}

export async function loginGoogle(
  accessToken: string
): Promise<UserAccessToken> {
  const result = await fetchGql<{ loginGoogle: UserAccessToken }>({
    query: `
      mutation LoginGoogle($accessToken: String!) {
        loginGoogle(accessToken: $accessToken) {
          user {
            name
            email
          }
          accessToken
        }
      }
    `,
    variables: {
      accessToken,
    },
  });
  return result.loginGoogle;
}

export async function login(accessToken: string): Promise<UserAccessToken> {
  const result = await fetchGql<{ login: UserAccessToken }>({
    query: `
      mutation Login($accessToken: String!) {
        login(accessToken: $accessToken) {
          user {
            name
            email
          }
          accessToken
        }
      }
    `,
    variables: {
      accessToken,
    },
  });
  return result.login;
}
