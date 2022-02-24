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