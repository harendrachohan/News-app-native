import { gql } from "@apollo/client";

export const SEARCH_NEWS = gql`
  query SearchNews($page: Int, $limit: Int!, $category: String!) {
    articles(page: $page, limit: $limit, category: $category) {
      page
      limit
      data {
        id
        title
        url
        summary
        publishedAt
        imageUrl
        category
      }
    }
  }
`;


export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
      id
      title
      url
      content
      summary
      publishedAt
      imageUrl
      category
    }
  }
`;