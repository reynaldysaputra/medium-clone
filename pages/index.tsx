import { NextPage } from 'next';
import Head from 'next/head'
import Link from 'next/link';
import Header from '../components/Header'
import {sanityClient, urlFor} from '../sanity';
import { Post } from '../type';

interface Props {
  posts: Post[]
}

const Home = ({posts}: Props) => {
  return (
    <div className=''>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      
      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0 max-w-5xl mx-auto'> 
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl font-serif max-w-xl'><span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read, and connect</h1>
          <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
        </div>
        <img 
          className='hidden md:inline-flex h-32 lg:h-full'
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" 
        />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 max-w-5xl mx-auto'>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <a>
              <div className='border rounded-lg group overflow-hidden cursor-pointer'>
                <img 
                  src={urlFor(post.mainImage).url()!} 
                  className='h-60 w-full object-cover group-hover:scale-105 transition-transform'
                />
                <div className='flex justify-between p-5 bg-white'>

                  <div>
                    <p className='font-bold text-lg'>{post.title}</p>
                    <p className='text-xs'>{post.description} by {post.author.name}</p>
                  </div>

                  <img className='w-12 h-12 rounded-full object-cover' src={urlFor(post.author.image).url()!} alt="" />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home;

export async function getServerSideProps() {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    _create_at,
    author -> {
    name,
    image
  },
  description,
  mainImage,
  body
  }`

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts
    }
  }
}