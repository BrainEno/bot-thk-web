import React, { CSSProperties,useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { NextRouter, withRouter } from 'next/router';

import { getCookie } from '../../actions/auth';
import { createBlog } from '../../actions/blog';
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false
});
import { useDispatch, useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';

import { QuillFormats,QuillModules } from '../../helpers/quillConfig';
import { clearTagCats,loadCats, loadTags } from '../../redux/actions';
import { RootState } from '../../redux/reducers';
import ImgUploader from '../ImgUploader';

const CreateBlog = ({ router }: { router: NextRouter }) => {
  const token = getCookie('token');
  const selectTags = (state: RootState) => state.tagsCats.tags;
  const selectCats = (state: RootState) => state.tagsCats.cats;
  const tags = useSelector(selectTags);
  const cats = useSelector(selectCats);
  const dispatch = useDispatch();

  const blogFromLS = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    if (localStorage.getItem('blog')) {
      return JSON.parse(localStorage.getItem('blog')!);
    } else {
      return false;
    }
  };

  const [checkedCats, setCheckedCats] = useState<string[]>([]);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);

  const [body, setBody] = useState(blogFromLS());
  const [values, setValues] = useState<{
    error: string;
    sizeError: string;
    successMsg: string;
    formData: null | FormData;
    title: string;
    hidePublishButton: boolean;
  }>({
    error: '',
    sizeError: '',
    successMsg: '',
    formData: null,
    title: '',
    hidePublishButton: false
  });

  const { error, successMsg, formData, title } = values;

  useEffect(() => {
    setValues((values) => ({ ...values, formData: new FormData() }));
    dispatch(loadCats());
    dispatch(loadTags());
  }, [router, dispatch]);

  const publishBlog: React.FormEventHandler = (e) => {
    e.preventDefault();

    createBlog(formData as FormData, token!).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          error: '',
          successMsg: `《${data.title}》已成功发布！`
        });
        setBody('');
        dispatch(clearTagCats());
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgForm = new FormData();
    if (e.target.files) {
      const url = process.env.CLOUDINARY_URL!;
      console.log('url:', url);
      const image = e.target.files[0];
      imgForm.append('image', image);
      console.log(image.name);
      // fetch(`https://api.cloudinary.com/v1_1/${process.env.}`)
    }
  };

  const handleBody = (e: string) => {
    setBody(e);
    formData!.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e));
    }
  };

  const handleToggle = (c: string) => () => {
    setValues({ ...values, error: '' });
    const clickedCategory = checkedCats.indexOf(c);
    const all = [...checkedCats];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    setCheckedCats(all);
    formData!.set('categories', all.toString());
  };

  const handleTagsToggle = (t: string) => () => {
    setValues({ ...values, error: '' });
    const clickedTag = checkedTags.indexOf(t);
    const all = [...checkedTags];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }

    setCheckedTags(all);
    formData!.set('tags', all.toString());
  };

  const showCategories = () => {
    return (
      cats &&
      cats.map((c) => (
        <li key={c._id} className="checkbox-group">
          <input type="checkbox" onChange={handleToggle(c._id)} />
          <label>{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t) => (
        <li key={t._id} className="checkbox-group">
          <input type="checkbox" onChange={handleTagsToggle(t._id)} />
          <label>{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ dispaly: error ? '' : 'none' } as CSSProperties}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div style={{ dispaly: successMsg ? '' : 'none' } as CSSProperties}>
      {successMsg}
    </div>
  );

  const createBLogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="input-container">
          <input
            type="text"
            className="form-control"
            value={title}
            name="title"
            onChange={handleChange}
            placeholder="输入题目..."
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={body}
            placeholder="开始创作..."
            onChange={handleBody}
          />
        </div>
        <div className="btn-container">
          <button type="submit" className="my-3 form-btn right">
            发布文章
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="blog-creator-container">
      <div className="blog-form">
        {error && showError()}
        {successMsg && showSuccess()}
        <div className="blog-form-container">{createBLogForm()}</div>
      </div>
      <div className="right-container">
        <div className="upload-pic">
          <div>
            <h5>
              配图 <small className="text-muted">{`(<1MB)`}</small>
            </h5>
            <ImgUploader />
            <hr />
            <label className="upload-btn">
              <UploadOutlined />
              上传图片
              <input
                type="file"
                onChange={uploadImage}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>
        <div>
          <h5>
            分类 <small className="text-muted">{`(必选)`}</small>
          </h5>
          <hr />
          <ul>{showCategories()}</ul>
        </div>
        <div>
          <h5>
            标签 <small className="text-muted">{`(必选)`}</small>
          </h5>
          <hr />
          <ul>{showTags()}</ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);
