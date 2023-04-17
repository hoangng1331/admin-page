import React from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function FormUpload() {
  return (
    <Layout>
      <Content>
        <form enctype='multipart/form-data' action='http://localhost:5000/upload/products/' method='post'>
          <input type='file' name='file' />
          <input type='text' name='name' />
          <input type='text' name='description' />
          <input type='submit' value='Upload' name='submit' />
        </form>
      </Content>
    </Layout>
  );
}
