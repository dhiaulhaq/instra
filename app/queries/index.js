import { gql } from "@apollo/client";

export const DO_LOGIN = gql`
mutation UserLogin($username: String!, $password: String!) {
  userLogin(username: $username, password: $password) {
    statusCode
    message
    error
    data {
      token
      userId
    }
  }
}
`;

export const DO_REGISTER = gql`
mutation UserCreate($input: UserCreateInput) {
  userCreate(input: $input) {
    statusCode
    message
    error
  }
}
`;

export const GET_USERS = gql`
query UserFetchAll {
  userFetchAll {
    _id
    name
    username
    email
  }
}
`;

export const GET_USER_DETAIL = gql`
query UserDetail($userDetailId: String) {
  userDetail(id: $userDetailId) {
    _id
    name
    username
    email
    Followings {
      _id
      name
      username
      email
    }
    Followers {
      _id
      name
      username
      email
    }
    Posts {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
    }
  }
}
`;

export const GET_USERS_SEARCH = gql`
query UserSearch($keyword: String!) {
  userSearch(keyword: $keyword) {
    _id
    name
    username
    email
  }
}
`;


export const GET_POSTS = gql`
query PostFetchAll {
  postFetchAll {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    Author {
      _id
      name
      username
      email
    }
  }
}
`;

export const GET_POST_DETAIL = gql`
query PostDetail($postDetailId: String) {
  postDetail(id: $postDetailId) {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    Author {
      _id
      name
      username
      email
    }
  }
}
`;

export const DO_CREATE_POST = gql`
mutation PostCreate($input: PostCreateInput) {
  postCreate(input: $input) {
    statusCode
    message
  }
}
`;

export const DO_LIKE_POST = gql`
mutation LikePost($input: LikeInput) {
  likePost(input: $input) {
    statusCode
    message
  }
}
`;

export const DO_COMMENT_POST = gql`
mutation CommentPost($input: CommentInput) {
  commentPost(input: $input) {
    statusCode
    message
  }
}
`;

export const DO_FOLLOW = gql`
mutation FollowCreate($input: FollowCreateInput) {
  followCreate(input: $input) {
    statusCode
    message
  }
}
`;