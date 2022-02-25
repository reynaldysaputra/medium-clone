export interface Post {
  _id: string;
  title: string;
  _createAt: string,
  body: string;
  author: {
    name: string;
    image: {
      asset: {
        _ref: string
      }
    }
  };
  comments: Comment[];
  description: string;
  mainImage: {
    asset: {
      _ref: string
    }
  };
  slug: {
    current: string
  };
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string
  };
  _createAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updateAt: string
}