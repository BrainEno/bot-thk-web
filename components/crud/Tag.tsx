import { useCallback,useEffect, useState } from 'react';

import { getCookie } from '../../actions/auth';
import { createTag, listTags, removeTag } from '../../actions/tag';
import { ITag } from '../../types';

const Tag: React.FC = () => {
  const [values, setValues] = useState<{
    name: string;
    error: boolean;
    success: boolean;
    tags: ITag[];
    removed: boolean;
    reload: boolean;
  }>({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie('token');

  //加载类别数据
  const loadTags = useCallback(() => {
    listTags().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues((values) => ({ ...values, tags: data }));
      }
    });
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  //显示所有类别
  const showTags = () => {
    return tags.map((t, i) => (
      <button
        onDoubleClick={() => deleteConfirm(t.slug)}
        title="双击删除此标签"
        key={i}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {t.name}
      </button>
    ));
  };

  //验证是否删除类别
  const deleteConfirm = (slug: string) => {
    const answer = window.confirm('确定要删除这个标签吗?');
    if (answer) {
      deleteTag(slug);
    }
  };

  //删除类别
  const deleteTag = (slug: string) => {
    removeTag(slug, token!).then((data) => {
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
    createTag({ name }, token!).then((data) => {
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
      return <p className="text-success">标签创建成功</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className="text-danger">标签已存在</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">标签已删除</p>;
    }
  };

  const mouseMoveHandler: React.MouseEventHandler = () => {
    setValues({ ...values, error: false, success: false, removed: false });
  };

  const newTagForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted my-2">标签</label>
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
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
};

export default Tag;
