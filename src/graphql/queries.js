import { gql } from "@apollo/client";

export const SEARCH_NEWS = gql`
  query SearchNews($search: String) {
    articles(search: $search) {
      id
      title
      description
      image
      source
      publishedAt
    }
  }
`;


export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      image
      content
      source
      category
      publishedAt
    }
  }
`;