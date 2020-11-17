import Link from "next/link";
import Admin from "../../components/auth/Admin";
import React from "react";

const AdminIndex = () => {
  return (
    <Admin>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12 pt-5 pb-5'>
            <h2>Admin Dashboard</h2>
          </div>
        </div>
        <div className='col-md-4'>
          <ul className='list-group'>
            <li className='list-group-item'>
              <Link href='/admin/crud/category-tag'>
                <a>Create Category</a>
              </Link>
            </li>

            <li className='list-group-item'>
              <Link href='/admin/crud/blog'>
                <a>Create Blog</a>
              </Link>
            </li>

            <li className='list-group-item'>
              <Link href='/admin/crud/blogs'>
                <a>Update/Delate BLog</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='col-md-8'>right</div>
      </div>
    </Admin>
  );
};
export default AdminIndex;
