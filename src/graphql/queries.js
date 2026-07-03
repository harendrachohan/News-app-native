import { gql } from "@apollo/client";

export const SEARCH_NEWS = gql`
  query SearchNews($page: Int, $limit: Int!, $category: String!, $state: String) {
    articles(page: $page, limit: $limit, category: $category, state: $state) {
      page
      limit
      data {
        id
        category
        content
        createdAt
        id
        imageUrl
        lang
        publishedAt
        rank
        slug
        sourceId
        state
        summary
        title
        url
      }
    }
  }
`;


export const GET_ARTICLE = gql`
  query GetArticle($id: ID!) {
    article(id: $id) {
       id
        category
        content
        createdAt
        imageUrl
        lang
        publishedAt
        rank
        slug
        sourceId
        state
        summary
        title
        url
    }
  }
`;

export const SEARCH_ARTICLES = gql`
  query SearchArticles($q: String!, $page: Int, $limit: Int!) {
    searchArticles(q: $q, page: $page, limit: $limit) {
      page
      limit
      data {
        id
        category
        content
        createdAt
        imageUrl
        lang
        publishedAt
        rank
        slug
        sourceId
        state
        summary
        title
        url
      }
    }
  }
`;