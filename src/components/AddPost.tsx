'use client';
import styles from './page.module.css';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { createPost } from '@/lib/dbActions';
import Swal from 'sweetalert2';
import { CreatePostSchema } from '@/lib/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect } from 'next/navigation';

const tags = ['CAMPUS', 'CLASSES', 'EVENTS', 'FINANCIAL', 'IMPORTANT', 'OTHER', 'RESOURCES', 'SPORTS'];

const onSubmit = async (data: {title: string, content: string, category: string, authorEmail: string}) => {
  console.log('Submitted Post!');
  data.category = data.category.toLocaleLowerCase();
  Swal.fire({
    title: 'Post Created!',
    icon: 'success',
    confirmButtonText: 'OK',
    timer: 5000,
  });
  await createPost(data); 
}

const AddPost = () => {  
  const { data: session, status } = useSession();
  const currentUser = session?.user.email || '';
  const { register, handleSubmit, setValue, formState:{ errors } }  = useForm({
    resolver: yupResolver(CreatePostSchema),
    defaultValues: { authorEmail: currentUser },
  });

  useEffect(() => {
    if (currentUser) setValue('authorEmail', currentUser);
  }, [currentUser, setValue]);

  if (status === 'unauthenticated') redirect('/auth/signin')
  if (status === 'loading') // render loading gif or smth.
  console.log(session);
  //console.log(currentUser || 1);
  return (
    <Container>
      <Form className='my-4' onSubmit={handleSubmit(onSubmit)}>
        <Form.Group as={Row} className='mb-3' controlId="formHorizontalEmail">
          <Form.Label column sm={1}>
            <h4>Title</h4>
          </Form.Label>
          <Col>
            <Form.Control size='lg' 
            type='text'
            {...register('title')} 
            placeholder='Title'
            className={`${errors.title ? 'is-invalid' : ''}`}/>
          </Col>
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Control 
          rows={20} 
          cols={10}
          {...register('content')} 
          size="sm" as='textarea' 
          placeholder='. . .'
          className={`${errors.content ? 'is-invalid' : ''}`}/>
        </Form.Group>
        <Form.Group as={Row} className='mb-3'>
          <Form.Label column sm={1}>Category</Form.Label>
          <Col>
            <Form.Select {...register('category')}>
              <option>. . .</option>
                {tags.map((category) => 
                  <option key={category} value={category}>{category}</option>
                )}
            </Form.Select>
          </Col>
          <div className='invalid-feedback'>{errors.category?.message}</div>
        </Form.Group>
        <input type='hidden' {...register('authorEmail')}></input>
        <Form.Group className='d-flex justify-content-center'>
          <Button className={styles.postButton} type='submit'>
            Post
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default AddPost;
