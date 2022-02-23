import { GetStaticProps } from 'next';
import React from 'react';
import Header from '../../components/Header';
import { sanityClient } from '../../sanity';
import { Post } from '../../type';

interface Props {
  post: Post
}

const Post = ({post}: Props) => {
  console.log(post);
  
  return (
    <div>
      <Header/>
    </div>
  )
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug,
  }`;

  const posts = await sanityClient.fetch(query); 

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == "react-js-and-next-js"][0]{
    _id,
    slug,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    body
  }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug
  })

  if(!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60
  }
}