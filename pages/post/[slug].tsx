import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import PortableText from 'react-portable-text';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../type';
import {useForm, SubmitHandler} from 'react-hook-form';

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string
}

interface Props {
  post: Post
}

const Post = ({post}: Props) => {  
  const {
    register, 
    handleSubmit, 
    formState: {errors}
  } = useForm<IFormInput>();
  const [submited, setSubmited] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: "POST",
      body: JSON.stringify(data)
    }).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }

  return (
    <div>
      <Header/>

      <img 
        className='w-full h-60 object-cover'
        src={urlFor(post.mainImage).url()}
      />

      <article className='max-w-5xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
        
        <div className='flex items-center space-x-3'>
          <img 
            className='w-10 h-10 rounded-full'
            src={urlFor(post.author.image).url()} 
          />
          <p className='text-extralight text-sm'>
            Blog post by <span className='text-green-600'>{post.author.name}</span> Published at{" "} 
            {new Date(post._createAt).toLocaleString()}
          </p>
        </div>

        <div className='mt-10'>
          <PortableText
            dataset= {process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h3: (props: any) => (
                <h1 className='text-2xl font-bold my-5' {...props} />
              ),
              p: (props: any) => (
                <p className='text-xl font-bold my-5' {...props} />
              ),
              li: (props: any) => (
                <li className='ml-4 list-disc last-of-type:mb-5 first-of-type:mt-5'>{props.children}</li>
              ),              
              link: ({href, children}: any) => (
                <a href={href} className='text-blue-500 hover:underline'>{children}</a>
              ),
            }}
          />
        </div>
      </article>

      <hr className='max-w-lg my-y mx-auto border border-yellow-500' />

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10 '>
        <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
        <h4 className='font-3xl font-bold'>Leave a commment below!</h4>
        <hr className='py-3 mt-2' />

        <input 
          {...register("_id")}
          type="hidden"
          name='_id'
          value={post._id}
        />

        <label htmlFor="" className='black mb-5 '>
          <span className='text-gray-700'>Name</span>
          <input 
            className='shadow rounded border py-2 px-3 form-input block w-full ring-yellow-500' 
            type="text" 
            placeholder='John Applesed'
            {...register("name", {required: true})}
          />
        </label>
        <label htmlFor="" className='black mb-5 '>
          <span className='text-gray-700'>Email</span>
          <input 
            className='shadow rounded border py-2 px-3 form-input block w-full ring-yellow-500' 
            type="email" 
            placeholder='John Applesed' 
            {...register("email", {required: true})}
          />
        </label>
        <label htmlFor="" className='black mb-5 '>
          <span className='text-gray-700'>Name</span>
          <textarea 
            className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full outline-none ring-yellow-500 focus:ring' 
            placeholder='John Applesed' 
            rows={8} 
            {...register("comment", {required: true})}
          />
        </label>

        <input 
          type="submit"
          className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
        />
      </form>

      <div className='flex flex-col p-5'>
        {errors.name && <span className='text-red-500'>- The Name field is required</span>}
        {errors.email && <span className='text-red-500'>- The Emial field is required</span>}
        {errors.comment && <span className='text-red-500'>- The Comment field is required</span>}
      </div>

      <div className='flex flex-col p-10 my-10 mt-1 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
        <h3 className='text-4xl'>Comments</h3>
        <hr className='pb-2' />

        {post.comments.map(comment => (
          <div key={comment._id}>
            <p><span className='text-yellow-500'>{comment.name}</span>: {comment.comment}</p>
          </div>
        ))}
      </div>
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
    _createAt,
    author -> {
      name,
      image
    },
    'comments': *[
      _type == 'comment' &&
      post._ref == ^._id &&
      approved == true
    ],
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