import React, { useCallback,useEffect, useState } from 'react';

import { getCookie } from '../../actions/auth';
import {
  createCategory,
  listCategories,
  removeCategory
} from '../../actions/category';
import { ICategory } from '../../types';

const Category: React.FC = () => {
  const [values, setValues] = useState<{
    name: string;
    error: boolean;
    success: boolean;
    categories: ICategory[];
    removed: boolean;
    reload: boolean;
  }>({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie('token');

  //加载类别数据
  const loadCategories = useCallback(() => {
    listCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues((values) => ({ ...values, categories: data }));
      }
    });
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  //显示所有类别
  const showCategories = () => {
    return categories.map((c, i) => (
      <button
        onDoubleClick={() => deleteConfirm(c.slug)}
        title="双击删除此类别"
        key={i}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {c.name}
      </button>
    ));
  };

  //验证是否删除类别
  const deleteConfirm = (slug: string) => {
    const answer = window.confirm('确定要删除这个类别吗?');
    if (answer) {
      deleteCategory(slug);
    }
  };

  //删除类别
  const deleteCategory = (slug: string) => {
    removeCategory(slug, token!).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: '',
          removed: !removed,
          reload: !reload
        });
      }
    });
  };

  //提交新类别
  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    createCategory({ name }, token!).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: '',
          reload: !reload
        });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: false
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className="text-success">类别创建成功</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className="text-danger">类别已存在</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">类别已删除</p>;
    }
  };

  const mouseMoveHandler = () => {
    setValues({ ...values, error: false, success: false, removed: false });
  };

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted my-2">类别</label>
        <input
          required
          type="text"
          onChange={handleChange}
          value={name}
          className="form-control"
        />
      </div>
      <div>
        <button className="btn btn-primary form-control my-3" type="submit">
          创建
        </button>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </>
  );
};

export default Category;
